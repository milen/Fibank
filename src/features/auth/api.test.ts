import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginRequest } from "./api";
import { ApiError } from "../../utils/errors";

const fetchMock = vi.fn<typeof fetch>();

vi.stubGlobal("fetch", fetchMock);

const TEST_CREDENTIALS = {
  username: "test-user",
  password: "test-password",
} as const;

const INVALID_CREDENTIALS = {
  username: "invalid-user",
  password: "invalid-password",
} as const;

const API_LOGIN_RESPONSE = {
  id: 123,
  username: "test-user",
  email: "test.user@example.com",
  firstName: "Test",
  lastName: "User",
  gender: "other",
  image: "https://example.com/test-user.png",
  accessToken: "test-access-token",
  refreshToken: "test-refresh-token",
} as const;

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

describe("loginRequest", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("posts credentials to DummyJSON and returns a session", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(API_LOGIN_RESPONSE));

    const session = await loginRequest(
      TEST_CREDENTIALS.username,
      TEST_CREDENTIALS.password,
    );

    expect(fetchMock).toHaveBeenCalledWith("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: TEST_CREDENTIALS.username,
        password: TEST_CREDENTIALS.password,
        expiresInMins: 60,
      }),
    });

    expect(session).toEqual({
      user: {
        id: API_LOGIN_RESPONSE.id,
        username: API_LOGIN_RESPONSE.username,
        email: API_LOGIN_RESPONSE.email,
        firstName: API_LOGIN_RESPONSE.firstName,
        lastName: API_LOGIN_RESPONSE.lastName,
        gender: API_LOGIN_RESPONSE.gender,
        image: API_LOGIN_RESPONSE.image,
      },
      accessToken: API_LOGIN_RESPONSE.accessToken,
      refreshToken: API_LOGIN_RESPONSE.refreshToken,
    });
  });

  it("throws an ApiError with the server message when login fails", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          message: "Invalid credentials",
        },
        {
          status: 400,
        },
      ),
    );

    await expect(
      loginRequest(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password),
    ).rejects.toEqual(
      expect.objectContaining({
        name: "ApiError",
        message: "Invalid credentials",
        status: 400,
      }),
    );
  });

  it("throws an ApiError when the response body is not valid JSON", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("not-json", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      }),
    );

    const error = await loginRequest(
      TEST_CREDENTIALS.username,
      TEST_CREDENTIALS.password,
    ).catch((err: unknown) => err);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toEqual(
      expect.objectContaining({
        message: "Login failed (500)",
        status: 500,
      }),
    );
  });

  it("throws an ApiError when tokens are missing from a successful response", async () => {
    const responseWithoutTokens = {
      id: API_LOGIN_RESPONSE.id,
      username: API_LOGIN_RESPONSE.username,
      email: API_LOGIN_RESPONSE.email,
      firstName: API_LOGIN_RESPONSE.firstName,
      lastName: API_LOGIN_RESPONSE.lastName,
      gender: API_LOGIN_RESPONSE.gender,
      image: API_LOGIN_RESPONSE.image,
    };

    fetchMock.mockResolvedValueOnce(jsonResponse(responseWithoutTokens));

    await expect(
      loginRequest(TEST_CREDENTIALS.username, TEST_CREDENTIALS.password),
    ).rejects.toThrow("Unexpected login response");
  });

  it("propagates network failures from fetch", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(
      loginRequest(TEST_CREDENTIALS.username, TEST_CREDENTIALS.password),
    ).rejects.toThrow("Failed to fetch");
  });
});
