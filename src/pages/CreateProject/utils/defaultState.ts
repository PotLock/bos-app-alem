const DEFAULT_BANNER_IMAGE_CID = "bafkreih4i6kftb34wpdzcuvgafozxz6tk6u4f5kcr2gwvtvxikvwriteci";

const DEFAULT_STATE = {
  isDao: false,
  daoAddressTemp: "", // used while input is focused
  daoAddress: "", // set on input blur
  daoAddressError: "",
  existingSocialData: {},
  backgroundImage: {
    ipfs_cid: DEFAULT_BANNER_IMAGE_CID,
  },
  profileImage: "",
  name: "",
  nameError: "",
  originalCategories: [], // to keep track of removals
  categories: [],
  categoriesError: "",
  description: "",
  descriptionError: "",
  publicGoodReason: "",
  publicGoodReasonError: "",
  hasSmartContracts: false,
  originalSmartContracts: [], // to keep track of removals
  smartContracts: [["", ""]], // [chain, contractAddress]
  originalGithubRepos: [], // to keep track of removals
  githubRepos: [[""]],
  hasReceivedFunding: false,
  fundingSourceIndex: null,
  originalFundingSources: [], // to keep track of removals
  fundingSources: [],
  website: "",
  websiteError: "",
  twitter: "",
  twitterError: "",
  telegram: "",
  telegramError: "",
  github: "",
  githubError: "",
  socialDataFetched: false,
  socialDataIsFetching: false,
  isMultiAccountModalOpen: false,
  teamMember: "",
  teamMembers: [],
  nearAccountIdError: "",
  registrationSuccess: false,
  showAlert: false,
  alertMessage: "",
};

export default DEFAULT_STATE;