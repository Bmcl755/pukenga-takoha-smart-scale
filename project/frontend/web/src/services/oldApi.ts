import { Nurse } from "@/models/Nurse";
import axios from "axios";
import { BehaviorSubject } from "rxjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export enum LoginState {
  LOGGED_IN = "logged in",
  LOGGED_OUT = "logged out",
  PENDING = "pending",
}

export class Api {
  private axios;
  private _loginState: BehaviorSubject<LoginState> =
    new BehaviorSubject<LoginState>(LoginState.LOGGED_OUT);
  private _token: string = "";
  private _nurseId: String = "";
  private _loggedInNurse: Nurse | null = null;

  constructor(apiUrl: string | undefined) {
    this.axios = axios.create({
      baseURL: apiUrl,
    });
    if (typeof window != "undefined") {
      const storedToken = localStorage.getItem("token") ?? "";
      this._loginState.next(LoginState.PENDING);
      this.checkToken(storedToken)
        .then((result) => {
          if (result) {
            this._token = storedToken;
            this._loginState.next(LoginState.LOGGED_IN);
          } else {
            this._token = "";
            this._loginState.next(LoginState.LOGGED_OUT);
          }
        })
        .catch((error) => {
          console.log("Error in checking token");
        });
    }
  }

  public get loginState() {
    return this._loginState.asObservable();
  }

  public get token() {
    return this._token;
  }

  public get nurseId() {
    return this._nurseId;
  }

  public async login(username: string, password: string): Promise<Boolean> {
    return this.axios
      .post("/login", {
        username: username,
        password: password,
      })
      .then(async ({ data }) => {
        if (!data.token) {
          return false;
        }
        this._token = data.token;
        this._loginState.next(LoginState.LOGGED_IN);
        this._nurseId = (jwt.decode(this.token) as any).nurseId;
        await this.getLoggedInNurse();
        localStorage.setItem("token", data.token);
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }

  public logout() {
    localStorage.setItem("token", "");
    this._token = "";
    this._loginState.next(LoginState.LOGGED_OUT);
  }

  private async checkToken(token: string) {
    return this.axios
      .get("/login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data == "Token is valid") {
          interface Test {
            nurseId: String;
          }
          const payload: Test | null = jwt.decode(token) as any;
          if (payload?.nurseId === undefined) {
            throw Error("Nurse ID not found on jwt");
          }
          this._nurseId = payload.nurseId;
          return true;
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        this._loginState.next(LoginState.LOGGED_OUT);
        return false;
      });
  }

  public async getAllNurses() {
    return this.axios
      .request({
        method: "GET",
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        url: "/nurses",
      })
      .then(({ data }) => {
        return data;
      });
  }

  public async getLoggedInNurse() {
    if (this._loginState.value === LoginState.LOGGED_OUT) {
      console.error("No logged in nurse detected");
    }
    if (this._loggedInNurse === null) {
      const nurse: Nurse = (
        await this.axios.get(`/nurses/${this.nurseId}`, {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        })
      ).data;
      this._loggedInNurse = nurse;
    }
    return this._loggedInNurse;
  }

  public async getAssignedChildren() {
    if (this._loginState.value === LoginState.LOGGED_OUT) {
      console.log("No logged in nurse detected");
      return;
    }
    try {
      const childrenResponse = await this.axios.get(`/assigned-children`, {
        headers: { Authorization: `Bearer ${this._token}` },
      });
      return childrenResponse.data;
    } catch (error) {
      // network error
      return;
    }
  }

  public async getChildById(id: string) {
    if (this._loginState.value === LoginState.LOGGED_OUT) {
      console.error("No logged in nurse detected");
    }
    const childResponse = await this.axios.get(`/children/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return childResponse.data;
  }

  public async createChildRecord(
    first_name: string,
    last_name: string,
    address: string
  ) {
    if (this._loginState.value === LoginState.LOGGED_OUT) {
      console.error("No logged in nurse detected");
    }
    const newRecordResponse = await this.axios.post(
      "/children",
      {
        first_name: first_name,
        last_name: last_name,
        address: address,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return newRecordResponse.data;
  }

  public async postWeighing(childId: string | string[], weight: string) {
    if (this._loginState.value === LoginState.LOGGED_OUT) {
      console.error("No logged in nurse detected");
    }
    const newWeighingResponse = await this.axios.post(
      `/children/${childId}/weighings`,
      {
        weight: weight,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return newWeighingResponse.data;
  }

  // TODO Add get weight from scale by scale id
}
