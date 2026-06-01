import { authOptions } from "@/lib/auth";
import { vi } from "vitest";

vi.mock("siwe", () => {
  return {
    SiweMessage: class {
      address: string;
      constructor(payload: { address: string }) {
        this.address = payload.address;
      }
      async verify() {
        return { success: true };
      }
    }
  };
});

describe("Wallet auth provider", () => {
  it("authorizes valid SIWE payload", async () => {
    process.env.NEXTAUTH_URL = "http://localhost:3000";

    const provider: any = authOptions.providers.find((p) => p.id === "wallet");
    const credentials = {
      message: JSON.stringify({ address: "0xabc" }),
      signature: "0xsignature"
    };
    const req = {
      headers: new Headers({
        cookie: "siwe-nonce=nonce-123",
        host: "localhost:3000"
      })
    } as any;

    const user = await provider.authorize(credentials, req);
    expect(user).toMatchObject({ address: "0xabc" });
  });

  it("rejects when nonce missing", async () => {
    const provider: any = authOptions.providers.find((p) => p.id === "wallet");
    const credentials = {
      message: JSON.stringify({ address: "0xabc" }),
      signature: "0xsignature"
    };
    const req = { headers: new Headers({ host: "localhost:3000" }) } as any;

    const user = await provider.authorize(credentials, req);
    expect(user).toBeNull();
  });
});
