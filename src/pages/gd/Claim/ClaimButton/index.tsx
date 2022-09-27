import React, {useCallback, useEffect, useState} from "react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useClaim } from "@gooddollar/web3sdk-v2";
import Loader from "../../../../components/Loader";
import { StyledButton } from "./styled";


const ClaimButton = () => {
	const { i18n } = useLingui()
	const [refresh, setRefresh] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	// TODO: merge only after useGetContract fix and check!!!
	const { isWhitelisted, claimAmount, claimTime, claimCall } = useClaim(refresh ? "everyBlock" : "never");

	const handleClaim = useCallback(async () => {
		if (isWhitelisted) {
			setLoading(true)
			await claimCall.send();
			setLoading(false)
		} else {
			setShowModal(true);
		}
	}, [claimCall, isWhitelisted]);

	useEffect(() => {
		if (!isWhitelisted || claimCall?.state?.status === "Mining" || claimCall?.state?.status === "PendingSignature") {
			setRefresh(true);
		} else setRefresh(false);
	}, [isWhitelisted, claimCall?.state]);

	const buttonTitle = () => {
		if (isWhitelisted) {
			if (claimAmount.toNumber() > 0) return  `${i18n._(t`Claim ${claimAmount}`)}`;
			else return `${i18n._(t`Claim next At : ${claimTime}`)}`;
		}

		return i18n._(t`Verify Uniqueness`);
	};

	return loading  ? <Loader size="32px" /> : (
		<StyledButton onClick={handleClaim}>
			{buttonTitle()}
		</StyledButton>
	);
};

export default ClaimButton
