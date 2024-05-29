import { Social, State, context, state, useParams, Tooltip, OverlayTrigger, useEffect } from "alem";
import Button from "@app/components/Button";
import Dropdown from "@app/components/Inputs/Dropdown/Dropdown";
import ToastContainer from "@app/components/ToastNotification/getToastContainer";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import { getConfig, getPotProjects } from "@app/services/getPotData";
import _address from "@app/utils/_address";
import daysAgo from "@app/utils/daysAgo";
import getTransactionsFromHashes from "@app/utils/getTransactionsFromHashes";
import hrefWithParams from "@app/utils/hrefWithParams";
import ApplicationReviewModal from "../../components/ApplicationReviewModal/ApplicationReviewModal";
import APPLICATIONS_FILTERS_TAGS from "./APPLICATIONS_FILTERS_TAGS";
import {
  ApplicationRow,
  Container,
  Dot,
  ApplicationsWrapper,
  DropdownLabel,
  Filter,
  SearchBar,
  Status,
} from "./styles";

const Applications = () => {
  const accountId = context.accountId;
  const { potId, transactionHashes } = useParams();

  State.init({
    newStatus: "",
    potDetail: null,
    projectId: "",
    searchTerm: "",
    allApplications: null,
    filteredApplications: [],
    filterVal: "ALL",
    toastContent: {
      title: "",
      description: "",
    },
  });

  const {
    newStatus,
    projectId,
    searchTerm,
    allApplications,
    filteredApplications,
    filterVal,
    toastContent,
    potDetail,
  } = state;

  const getApplicationCount = (sortVal: string) => {
    if (!allApplications) return;
    return allApplications?.filter((application: any) => {
      if (sortVal === "All") return true;
      return application.status === sortVal;
    })?.length;
  };

  useEffect(() => {
    if (!potDetail)
      getConfig({
        potId,
        updateState: (potDetail) =>
          State.update({
            potDetail,
          }),
      });
    if (!allApplications)
      getPotProjects({
        potId,
        isApprpved: false,
        updateState: (applications) =>
          State.update({
            allApplications: applications,
            filteredApplications: applications,
          }),
      });
  }, []);

  if (allApplications === null || potDetail === null)
    return <div className="spinner-border text-secondary" role="status" />;

  const { owner, admins, chef } = potDetail;

  const toast = (newStatus: string) => {
    State.update({
      toastContent: {
        title: "Updated Successfully!",
        description: `Application status has been successfully updated to ${newStatus}.`,
      },
    });
    setTimeout(() => {
      State.update({
        toastContent: {
          title: "",
          description: "",
        },
      });
    }, 7000);
  };

  // Handle update application status for web wallet
  useEffect(() => {
    if (accountId && transactionHashes) {
      getTransactionsFromHashes(transactionHashes, accountId).then((trxs) => {
        const transaction = trxs[0].body.result.transaction;

        const methodName = transaction.actions[0].FunctionCall.method_name;
        const successVal = trxs[0].body.result.status?.SuccessValue;
        const result = JSON.parse(Buffer.from(successVal, "base64").toString("utf-8"));

        if (methodName === "chef_set_application_status" && result) {
          toast(result.status);
        }
      });
    }
  }, []);

  const isChefOrGreater = accountId === chef || admins.includes(accountId || "") || accountId === owner;

  const handleApproveApplication = (projectId: string) => {
    State.update({ newStatus: "Approved", projectId });
  };

  const handleRejectApplication = (projectId: string) => {
    State.update({ newStatus: "Rejected", projectId });
  };

  const handleCloseModal = () => {
    State.update({ newStatus: "", projectId: "" });
  };

  const searchApplications = (searchTerm: string) => {
    // filter applications that match the search term (message, project_id, review_notes or status)
    const filteredApplications = allApplications?.filter((application: any) => {
      const { message, project_id, review_notes, status } = application;
      const searchFields = [message, project_id, review_notes, status];
      return searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    });
    return filteredApplications;
  };

  const APPLICATIONS_FILTERS: any = {
    ALL: {
      label: "All applications",
      val: "ALL",
      count: getApplicationCount("All"),
    },
    PENDING: {
      label: "Pending applications",
      val: "PENDING",

      count: getApplicationCount("Pending"),
    },
    APPROVED: {
      label: "Approved applications",
      val: "APPROVED",
      count: getApplicationCount("Approved"),
    },
    REJECTED: {
      label: "Rejected applications",
      val: "REJECTED",
      count: getApplicationCount("Rejected"),
    },
  };

  const sortApplications = (key: string) => {
    if (key === "ALL") {
      return searchApplications(searchTerm);
    }
    const filtered = allApplications?.filter((application: any) => {
      return application.status === APPLICATIONS_FILTERS[key].label.split(" ")[0];
    });
    return filtered;
  };

  const handleSort = (key: string) => {
    const sorted = sortApplications(key);
    State.update({ filteredApplications: sorted, filterVal: key });
  };

  const DropdownVal = () => {
    const digit = APPLICATIONS_FILTERS[filterVal].count.toString().length;
    return (
      <DropdownLabel>
        <div className="label">{APPLICATIONS_FILTERS[filterVal].label}</div>
        <div
          className="count"
          style={{
            width: `${24 + (digit - 1) * 6}px`,
            height: `${24 + (digit - 1) * 6}px`,
          }}
        >
          {APPLICATIONS_FILTERS[filterVal].count}
        </div>
      </DropdownLabel>
    );
  };

  return (
    <Container>
      <div className="dropdown">
        <Dropdown
          {...{
            sortVal: <DropdownVal />,
            showCount: true,
            sortList: Object.values(APPLICATIONS_FILTERS),
            menuStyle: { left: "auto", right: "auto" },
            handleSortChange: ({ val }) => {
              handleSort(val);
            },
          }}
        />
      </div>
      <Filter>
        {Object.keys(APPLICATIONS_FILTERS).map((key) => (
          <div key={key} className={`item ${filterVal === key ? "active" : ""}`} onClick={() => handleSort(key)}>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.59631 8.9057L1.46881 5.7782L0.403809 6.8357L4.59631 11.0282L13.5963 2.0282L12.5388 0.970703L4.59631 8.9057Z"
                fill="#7B7B7B"
              />
            </svg>

            <div> {APPLICATIONS_FILTERS[key].label}</div>
            <div className="count">{APPLICATIONS_FILTERS[key].count}</div>
          </div>
        ))}
      </Filter>
      <ApplicationsWrapper>
        <SearchBar>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.81641 8.69141H9.22391L9.01391 8.48891C9.74891 7.63391 10.1914 6.52391 10.1914 5.31641C10.1914 2.62391 8.00891 0.441406 5.31641 0.441406C2.62391 0.441406 0.441406 2.62391 0.441406 5.31641C0.441406 8.00891 2.62391 10.1914 5.31641 10.1914C6.52391 10.1914 7.63391 9.74891 8.48891 9.01391L8.69141 9.22391V9.81641L12.4414 13.5589L13.5589 12.4414L9.81641 8.69141ZM5.31641 8.69141C3.44891 8.69141 1.94141 7.18391 1.94141 5.31641C1.94141 3.44891 3.44891 1.94141 5.31641 1.94141C7.18391 1.94141 8.69141 3.44891 8.69141 5.31641C8.69141 7.18391 7.18391 8.69141 5.31641 8.69141Z"
              fill="#7B7B7B"
            />
          </svg>
          <input
            type="text"
            placeholder="Search applications"
            className="search-input"
            onChange={(e) => {
              const results = searchApplications(e.target.value);
              State.update({ searchTerm: e.target.value, filteredApplications: results });
            }}
          />
        </SearchBar>
        {filteredApplications.length ? (
          filteredApplications.map(({ project_id, status, message, review_notes, submitted_at }: any) => {
            const { borderColor, color, icon, label, background } = APPLICATIONS_FILTERS_TAGS[status];

            const profile: any = Social.getr(`${project_id}/profile`);

            return (
              <ApplicationRow key={project_id}>
                <input type="checkbox" className="toggle-check" />
                <div className="header">
                  <div className="header-info">
                    <ProfileImage profile={profile} accountId={project_id} style={{}} className="profile-image" />
                    {profile?.name && <div className="name">{_address(profile?.name, 10)}</div>}

                    <OverlayTrigger placement="top" overlay={<Tooltip>{project_id}</Tooltip>}>
                      <a
                        className="address"
                        href={hrefWithParams(`?tab=project&projectId=${project_id}`)}
                        target="_blank"
                      >
                        {_address(project_id, 10)}
                      </a>
                    </OverlayTrigger>

                    <Dot />
                    <div className="date">{daysAgo(submitted_at)}</div>
                  </div>
                  <Status
                    style={{
                      borderColor,
                      color,
                      background,
                    }}
                  >
                    <div>{label}</div>
                    {icon}
                  </Status>
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    className="arrow"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 0.294922L0 6.29492L1.41 7.70492L6 3.12492L10.59 7.70492L12 6.29492L6 0.294922Z"
                      fill="#7B7B7B"
                    />
                  </svg>
                </div>
                <div className="content">
                  <div className="message">{message}</div>
                  {review_notes && (
                    <div className="notes">
                      <div className="title">Admin notes:</div>
                      <div>{review_notes}</div>
                    </div>
                  )}
                  {isChefOrGreater && (
                    <>
                      {status !== "Approved" && (
                        <Button
                          {...{
                            varient: "tonal",
                            onClick: () => handleApproveApplication(project_id),
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      {status !== "Rejected" && (
                        <Button onClick={() => handleRejectApplication(project_id)}>Reject</Button>
                      )}
                    </>
                  )}
                </div>
              </ApplicationRow>
            );
          })
        ) : (
          <div style={{ padding: "1rem" }}>No applications to display</div>
        )}
      </ApplicationsWrapper>
      {projectId && (
        <ApplicationReviewModal toast={toast} projectId={projectId} newStatus={newStatus} onClose={handleCloseModal} />
      )}
      <ToastContainer toastContent={toastContent} />
    </Container>
  );
};

export default Applications;
