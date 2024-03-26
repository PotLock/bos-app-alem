import { context } from "alem";
import RegistrySDK from "../SDK/registry";

const isRegistryAdmin = RegistrySDK.isRegistryAdmin(context.accountId);
export default isRegistryAdmin;
