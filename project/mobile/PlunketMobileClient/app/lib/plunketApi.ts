import axios, { AxiosError, AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { JwtPayload, jwtDecode } from "jwt-decode";

const API_BASE_URL = "https://capstone-project-team-15.onrender.com";
const AUTH_TOKEN_STORAGE_LOCATION = "PLUNKET_API_AUTH_TOKEN";
const AUTH_HEADER = "Authorization";

export enum AuthenticationState {
  LoggedIn,
  LoggedOut,
  Pending,
}

export interface AuthenticationResponse {
  success: boolean;
  message: string;
}

interface DecodedToken extends JwtPayload {
  nurseId: string | null;
}

export interface Child {
  _id: string;
  first_name: string;
  last_name: string;
  address: string;
  weighings: Weighing[];
  assigned_nurses: string[];
  last_edited: string;
  __v: number;
}

export interface ChildrenResponse {
  success: boolean;
  message: string;
  children: Child[];
}

export interface Weighing {
  date: string;
  weight: number;
  _id: string;
}

export interface ScaleData {
  _id: string;
  physical_id: string;
  weighings: Weighing[];
}

export class PlunketApi {
  // Note: Always set the authentication state using the setter - this will ensure the callback is called
  // Do not use #authenticationState directly
  #authenticationState: AuthenticationState;
  #token: string | null;
  #onAuthStateChangeCallback: (newState: AuthenticationState) => void | null;
  #axiosInstance: AxiosInstance;

  constructor() {
    // Set the initial authentication state to pending
    this.authenticationState = AuthenticationState.Pending;

    // Set up the axios instance
    this.#axiosInstance = axios.create({
      baseURL: API_BASE_URL,
    });

    // Now we need to check the current authentication state
    // This returns a promise so we can't wait for it to finish in the constructor
    this.checkStoredAuthenticationState();
  }

  async checkStoredAuthenticationState() {
    // Check if there is a token stored
    const authToken = await SecureStore.getItemAsync(
      AUTH_TOKEN_STORAGE_LOCATION
    );

    if (authToken) {
      // If we have an auth token, check the validity
      this.authenticationState = AuthenticationState.LoggedIn;
      const isValid = await this.checkTokenValidity(authToken);

      if (isValid) {
        // If the token is valid, set the token and state
        this.#token = authToken;
        this.authenticationState = AuthenticationState.LoggedIn;
        return;
      } else {
        // If the token is not valid, delete it
        await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE_LOCATION);
      }
    }

    // If we don't have an auth token or it's not valid, set the state to logged out
    this.#token = null;
    this.authenticationState = AuthenticationState.LoggedOut;
  }

  // Returns true if token is valid, false otherwise
  private async checkTokenValidity(token: string) {
    const response = await this.#axiosInstance.get("/login", {
      headers: {
        [AUTH_HEADER]: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  }

  setAuthenticationStateChangeCallback(
    callback: (newState: AuthenticationState) => void
  ) {
    this.#onAuthStateChangeCallback = callback;
  }

  private set authenticationState(newState: AuthenticationState) {
    this.#authenticationState = newState;
    if (this.#onAuthStateChangeCallback) {
      this.#onAuthStateChangeCallback(newState);
    }
  }

  public get authenticationState(): AuthenticationState {
    return this.#authenticationState;
  }

  // Attempts to login with a username and password
  // Use authState to check if the login was successful
  // Returns false if an error occurred sending the request
  async login(
    username: string,
    password: string
  ): Promise<AuthenticationResponse> {
    this.authenticationState = AuthenticationState.Pending;
    try {
      const response = await this.#axiosInstance.post("/login", {
        username,
        password,
      });

      if (!response.data.token) {
        this.authenticationState = AuthenticationState.LoggedOut;
        return {
          success: false,
          message: "Server did not return a valid response. Please try again.",
        };
      }

      this.#token = response.data.token;
      this.authenticationState = AuthenticationState.LoggedIn;
      await SecureStore.setItemAsync(AUTH_TOKEN_STORAGE_LOCATION, this.#token);
      return {
        success: true,
        message: "Successfully logged in",
      };
    } catch (error) {
      if (error.response.status === 404) {
        this.authenticationState = AuthenticationState.LoggedOut;
        return {
          success: false,
          message: "Invalid username or password. Please try again.",
        };
      }

      this.authenticationState = AuthenticationState.LoggedOut;
      return {
        success: false,
        message: "Failed to connect to the server. Please try again.",
      };
    }
  }

  async logout() {
    this.authenticationState = AuthenticationState.LoggedOut;
    this.#token = null;
    await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE_LOCATION);
  }

  async getUserId(): Promise<string> {
    if (!this.#token) {
      return "";
    }

    // We need to decode the token and extract the nurseId
    const decodedToken = jwtDecode<DecodedToken>(this.#token);

    return decodedToken.nurseId || "";
  }

  // Only returns children assigned to the nurse for security/privacy reasons
  async getChildren() {
    try {
      const response = await this.#axiosInstance.get("/assigned-children", {
        headers: {
          [AUTH_HEADER]: `Bearer ${this.#token}`,
        },
      });

      const children: Child[] = [];

      for (const child of response.data) {
        children.push(child as Child);
      }

      return {
        success: true,
        message: "",
        children: children,
      };
    } catch (error) {
      // Any non 2xx status code will throw an error
      // We also need to handle network errors

      // 401 means the token is invalid/not provided
      if (error.response.status === 401) {
        // Clear any stored tokens/flush auth
        await this.logout();

        // Let the FE know
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          children: [],
        };
      }

      // Otherwise network or server error
      return {
        success: false,
        message: "Failed to connect to the server. Please try again.",
        children: [],
      };
    }
  }

  async getChild(childId: string): Promise<ChildrenResponse> {
    try {
      const response = await this.#axiosInstance.get(`/children/${childId}`, {
        headers: {
          [AUTH_HEADER]: `Bearer ${this.#token}`,
        },
      });

      const children: Child[] = [];

      children.push(response.data as Child);

      return {
        success: true,
        message: "",
        children: children,
      };
    } catch (error) {
      // Any non 2xx status code will throw an error
      // We also need to handle network errors

      // 404 means the child was not found
      if (error.response.status === 404) {
        return {
          success: false,
          message: "Child not found.",
          children: [],
        };
      }

      // 401 means the token is invalid/not provided
      if (error.response.status === 401) {
        // Clear any stored tokens/flush auth
        await this.logout();

        // Let the FE know
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          children: [],
        };
      }

      // Otherwise network or server error
      return {
        success: false,
        message: "Failed to connect to the server. Please try again.",
        children: [],
      };
    }
  }

  async createWeighing(childId: string, weight: number) {
    try {
      // set POST type to be JSON
      const response = await this.#axiosInstance.post(
        `/children/${childId}/weighings`,
        {
          nurse_id: await this.getUserId(),
          weight: weight,
        },
        {
          headers: {
            [AUTH_HEADER]: `Bearer ${this.#token}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );

      return {
        success: true,
        message: "",
      };
    } catch (error) {
      // Any non 2xx status code will throw an error
      // We also need to handle network errors

      // 401 means the token is invalid/not provided
      if (error.response.status === 401) {
        // Clear any stored tokens/flush auth
        await this.logout();

        // Let the FE know
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
        };
      }

      // Otherwise network or server error
      return {
        success: false,
        message: "Failed to connect to the server. Please try again.",
      };
    }
  }

  async createNewChild(firstName, lastName, address) {
    try {
      const response = await this.#axiosInstance.post(
        `/children`,
        {
          first_name: firstName,
          last_name: lastName,
          address: address,
        },
        {
          headers: {
            [AUTH_HEADER]: `Bearer ${this.#token}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );

      return {
        success: true,
        message: "",
      };
    } catch (error) {
      // Any non 2xx status code will throw an error
      // We also need to handle network errors

      // 401 means the token is invalid/not provided
      if (error.response.status === 401) {
        // Clear any stored tokens/flush auth
        await this.logout();

        // Let the FE know
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
        };
      }

      // Otherwise network or server error
      return {
        success: false,
        message: "Failed to connect to the server. Please try again.",
      };
    }
  }

  async getScaleData(scaleId: string) {
    try {
      const response = await this.#axiosInstance.get(`/scales/${scaleId}`, {
        headers: {
          [AUTH_HEADER]: `Bearer ${this.#token}`,
        },
      });

      return {
        success: true,
        message: "",
        scale: response.data as ScaleData,
      };
    } catch (error) {
      // Any non 2xx status code will throw an error
      // We also need to handle network errors

      // 404 means the scale was not found
      if (error.response.status === 404) {
        return {
          success: false,
          message: "Scale not found.",
          scale: null,
        };
      }

      // 401 means the token is invalid/not provided
      if (error.response.status === 401) {
        // Clear any stored tokens/flush auth
        await this.logout();

        // Let the FE know
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          scale: null,
        };
      }

      // Otherwise network or server error
      return {
        success: false,
        message: "Failed to connect to the server. Please try again.",
        scale: null,
      };
    }
  }
}
