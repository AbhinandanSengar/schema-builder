import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";

export function getAuthSession() {
    return getServerSession(authOptions);
}