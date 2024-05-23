import { context, useEffect } from "alem";
import { useDonationModal } from "@app/hooks/useDonationModal";
import useModals from "@app/hooks/useModals";
import Button from "../Button";

const ButtonDonation = ({ allowDonate, projectId }: { allowDonate: boolean; projectId: string }) => {
  const Modals = useModals();
  const { setDonationModalProps } = useDonationModal();
  useEffect(() => {}, []); // make the component statefull so it does not break
  return (
    <div
      onClick={(e) => e.preventDefault()}
      style={{
        cursor: "default",
        color: "#292929",
      }}
    >
      <Modals />
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
