import { Near } from "alem";

const donateContractId = "donate.potlock.near";

const DonateSDK = {
  getContractId: () => donateContractId,
  getConfig: () => {
    return Near.view(donateContractId, "get_config", {});
  },
  asyncGetConfig: () => {
    return Near.asyncView(donateContractId, "get_config", {});
  },
  getDonations: (fromIndex, limit) => {
    return Near.view(donateContractId, "get_donations", {
      from_index: fromIndex || null,
      limit: limit || null,
    });
  },
  asyncGetDonations: (fromIndex, limit) => {
    return Near.asyncView(donateContractId, "get_donations", {
      from_index: fromIndex || null,
      limit: limit || null,
    });
  },
  getDonationsForRecipient: (recipientId) => {
    return Near.view(donateContractId, "get_donations_for_recipient", { recipient_id: recipientId });
  },
  asyncGetDonationsForRecipient: (recipientId) => {
    return Near.asyncView(donateContractId, "get_donations_for_recipient", {
      recipient_id: recipientId,
    });
  },
  getDonationsForProject: (projectId) => {},
  getDonationsForDonor: (donorId) => {
    return Near.view(donateContractId, "get_donations_for_donor", { donor_id: donorId });
  },
  asyncGetDonationsForDonor: (donorId) => {
    return Near.asyncView(donateContractId, "get_donations_for_donor", { donor_id: donorId });
  },
};

export default DonateSDK;
