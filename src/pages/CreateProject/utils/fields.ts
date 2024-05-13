export const addressNamed = [".tg", ".sweat", ".near"];

export const socialFields = [
  {
    label: "twitter",
    placeholder: "twitter.com/",
    error: "twitterError",
  },

  {
    label: "telegram",
    placeholder: "t.me/",
    error: "telegramError",
  },
  {
    label: "github",
    placeholder: "github.com/",
    error: "githubError",
  },
  {
    label: "website",
    placeholder: "https://",
    error: "websiteError",
  },
];

export const CATEGORY_MAPPINGS: any = {
  SOCIAL_IMPACT: "Social Impact",
  NON_PROFIT: "NonProfit",
  CLIMATE: "Climate",
  PUBLIC_GOOD: "Public Good",
  DE_SCI: "DeSci",
  OPEN_SOURCE: "Open Source",
  COMMUNITY: "Community",
  EDUCATION: "Education",
  _deprecated: {
    "social-impact": "SOCIAL_IMPACT",
    "non-profit": "NON_PROFIT",
    climate: "CLIMATE",
    "public-good": "PUBLIC_GOOD",
    "de-sci": "DE_SCI",
    "open-source": "OPEN_SOURCE",
    community: "COMMUNITY",
    education: "EDUCATION",
  },
};

export const CHAIN_OPTIONS: any = {
  NEAR: { isEVM: false },
  Solana: { isEVM: false },
  Ethereum: { isEVM: true },
  Polygon: { isEVM: true },
  Avalanche: { isEVM: true },
  Optimism: { isEVM: true },
  Arbitrum: { isEVM: true },
  BNB: { isEVM: true },
  Sui: { isEVM: false },
  Aptos: { isEVM: false },
  Polkadot: { isEVM: false },
  Stellar: { isEVM: false },
  ZkSync: { isEVM: false }, // Note: ZkSync aims for EVM compatibility but might not fully be considered as traditional EVM at the time of writing.
  Celo: { isEVM: true },
  Aurora: { isEVM: true },
  Injective: { isEVM: true },
  Base: { isEVM: false },
  Manta: { isEVM: false }, // Listed twice in the original list; included once here.
  Fantom: { isEVM: true },
  ZkEVM: { isEVM: true }, // Considering the name, assuming it aims for EVM compatibility.
  Flow: { isEVM: false },
  Tron: { isEVM: true },
  MultiverseX: { isEVM: false }, // Formerly known as Elrond, not traditionally EVM but has some level of compatibility.
  Scroll: { isEVM: true }, // Assuming EVM compatibility based on the context of ZkEVM.
  Linea: { isEVM: true }, // Assuming non-EVM due to lack of information.
  Metis: { isEVM: true },
};

export const DEFAULT_STATE = {
  isDao: false,
  daoAddressTemp: "", // used while input is focused
  daoAddress: "", // set on input blur
  daoAddressError: "",
  existingSocialData: {},
  backgroundImage: "",
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
  githubRepos: {},
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
