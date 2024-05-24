import { context } from "alem";
import { useDonationModal } from "@app/hooks/useDonationModal";
import Button from "../Button";

const ButtonDonation = ({ allowDonate, projectId }: { allowDonate: boolean; projectId: string }) => {
  const { setDonationModalProps } = useDonationModal();

  return (
    <div
      onClick={(e) => e.preventDefault()}
      style={{
        cursor: "default",
        color: "#292929",
      }}
    >
      {/* <Modals /> */}
      {allowDonate && context.accountId && (
        <Button
          varient="tonal"
          onClick={(e) => {
            e.preventDefault();
            setDonationModalProps({
              projectId,
            });
          }}
        >
          Donate
        </Button>
      )}
    </div>
  );
};

export default ButtonDonation;
