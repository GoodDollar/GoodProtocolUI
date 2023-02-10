import { useFVLink, openLink } from "@gooddollar/web3sdk-v2";
import { noop } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { FVFlowProps } from "../core";

interface FVModalActionProps extends Pick<FVFlowProps, "method" | "firstName"> {
  onClose: () => void;
  redirectUrl?: string;
}

export const useFVModalAction = ({ firstName, method, onClose = noop, redirectUrl }: FVModalActionProps) => {
  const fvlink = useFVLink();
  const [loading, setLoading] = useState(false);
  const redirectUri = useMemo(() => redirectUrl || document.location.href, [redirectUrl]);

  const verify = useCallback(async () => {
    setLoading(true);

    try {
      await fvlink?.getLoginSig();
      await fvlink?.getFvSig();
    } catch (e: any) {
      return;
    } finally {
      setLoading(false);
    }
    
    onClose();

    switch (method) {
      case "redirect": {
        const link = fvlink?.getLink(firstName, redirectUri, false);

        if (link) {
          openLink(link, "_self").catch(noop);
        }
        break;
      }
      case "popup":
      default: {
        const link = fvlink?.getLink(firstName, undefined, true);

        if (link) {
          openLink(link, "_blank", { width: "800px", height: "auto" }).catch(noop);
        }
        break;
      }
    }
  }, [fvlink, method, firstName, redirectUrl, onClose]);

  return { loading, verify };
};
