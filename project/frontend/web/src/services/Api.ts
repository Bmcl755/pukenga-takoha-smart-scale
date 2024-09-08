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
  private _role: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private _token: string = "";
  private _userId: String = "";
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

  public get userId() {
    return this._userId;
  }

  public get role() {
    return this._role.asObservable();
  }

  public async login(
    username: string,
    password: string,
    role: string
  ): Promise<Boolean> {
    return this.axios
      .post("/login", {
        username,
        password,
        role,
      })
      .then(async ({ data }) => {
        if (!data.token) {
          return false;
        }
        this._token = data.token;
        this._loginState.next(LoginState.LOGGED_IN);
        const decodedToken = jwt.decode(this.token) as any;
        this._role.next(decodedToken.role);
        if (decodedToken.role === "nurse") {
          this._userId = (jwt.decode(this.token) as any).nurseId;
          await this.getLoggedInNurse();
        }
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
    this._userId = "";
    this._loggedInNurse = null;
    this._role.next("");
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
          interface JwtPayload {
            role: string;
            nurseId?: string;
            parentId?: string;
            adminId?: string;
          }
          const payload: JwtPayload | null = jwt.decode(token) as any;
          console.log(payload);
          if (payload?.role === "nurse" && payload.nurseId) {
            this._userId = payload.nurseId;
            this._role.next("nurse");
          } else if (payload?.role === "parent" && payload.parentId) {
            this._userId = payload.parentId;
            this._role.next("parent");
          } else if (payload?.role === "admin" && payload.adminId) {
            this._userId = payload.adminId;
            this._role.next("admin");
          } else {
            console.error("There is no role ");
            return false;
          }
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
    if (this._role.value !== "admin") {
      console.error("Not an admin!");
      return;
    }
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
        await this.axios.get(`/nurses/${this.userId}`, {
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        })
      ).data;
      this._loggedInNurse = nurse;
    }
    return this._loggedInNurse;
  }

  public async getAllChildren() {
    if (this._role.value !== "admin") {
      console.error("Not an admin!");
      return;
    }
    return this.axios
      .request({
        method: "GET",
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        url: "/children",
      })
      .then(({ data }) => {
        return data;
      });
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
    return (
      await this.axios.post(
        "/children",
        { first_name, last_name, address },
        { headers: { Authorization: `Bearer ${this.token}` } }
      )
    ).data;
  }

  public async createNewNurse({
    firstName,
    lastName,
    username,
    password,
  }: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }) {
    return await this.axios.post(
      "/nurses",
      {
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
  }
  public async deleteNurse(nurseId: string) {
    return await this.axios.delete(`nurses/${nurseId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
  public async submitSupportRequest(request: string) {
    return await this.axios.post(
      "/support",
      { message: request },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
  }

  public async postWeighing(childId: string, weight: number) {
    if (this._loginState.value === LoginState.LOGGED_OUT) {
      console.error("No logged in nurse detected");
    }
    const newWeighingResponse = await this.axios.post(
      `/children/${childId}/weighings`,
      {
        nurse_id: this.userId,
        weight: weight,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return newWeighingResponse.data;
  }

  public async getWeighingByScaleId(scaleId: string) {
    if (this._loginState.value === LoginState.LOGGED_OUT) {
      console.error("No logged in nurse detected");
    }
    const weighingResponse = await this.axios.get(`/scales/${scaleId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return weighingResponse.data;
  }

  public async deleteChild(childId: string) {
    return await this.axios.delete(`children/${childId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
}
