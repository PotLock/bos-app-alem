import { getAlemEnvironment } from "alem";

const potlockRegistryListId = 1;

const _listContractId = getAlemEnvironment() === "staging" ? "lists.staging.potlock.near" : "lists.potlock.near";

const ListsSDK = {
  getContractId: () => _listContractId,
  getList: (listId) => {
    return Near.view(_listContractId, "get_list", { list_id: listId });
  },
  getPotlockRegistry: () => {
    return ListsSDK.getList(potlockRegistryListId);
  },
  isRegistryAdmin: (accountId) => {
    const registry = ListsSDK.getPotlockRegistry();
    return registry.admins && registry.admins.includes(accountId);
  },
  getRegistrations: (listId) => {
    return Near.view(_listContractId, "get_registrations_for_list", {
      list_id: listId || potlockRegistryListId,
    });
  },
  asyncGetRegistrations: (listId) => {
    return Near.asyncView(_listContractId, "get_registrations_for_list", {
      list_id: listId || potlockRegistryListId,
    });
  },
  getRegistration: (listId, registrantId) => {
    const registrations = Near.view(_listContractId, "get_registrations_for_registrant", {
      registrant_id: registrantId,
    });
    if (registrations) {
      const registration = registrations.find(
        (registration) => registration.list_id === (listId || potlockRegistryListId),
      );
      return Near.view(_listContractId, "get_registration", {
        registration_id: registration.id,
      });
    }
  },
  asyncGetRegistration: (listId, registrantId) => {
    // return Near.asyncView(_listContractId, "get_project_by_id", { project_id: projectId });
    return Near.asyncView(_listContractId, "get_registrations_for_registrant", {
      registrant_id: registrantId,
    }).then((registrations) => {
      if (registrations) {
        const registration = registrations.find(
          (registration) => registration.list_id === (listId || potlockRegistryListId),
        );
        return Near.asyncView(_listContractId, "get_registration", {
          registration_id: registration.id,
        });
      }
    });
  },
  isRegistrationApproved: (listId, registrantId) => {
    const registration = ListsSDK.getRegistration(listId, registrantId);
    return registration && registration.status === "Approved";
  },
};

export default ListsSDK;
