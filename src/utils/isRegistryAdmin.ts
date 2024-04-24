import { context } from "alem";
import ListsSDK from "@app/SDK/lists";

const isRegistryAdmin = ListsSDK.isRegistryAdmin(context.accountId);
export default isRegistryAdmin;
