import * as queryString from "query-string";
import * as React from "react";
import { Redirect } from "react-router";

import { appRoutes } from "../../appRoutes";
import { WalletSelector } from "../../wallet-selector/WalletSelector";

const SecretProtected = (Component: React.FunctionComponent): any =>
  class extends React.Component<void> {
    shouldComponentUpdate(): boolean {
      return false;
    }

    render(): React.ReactNode {
      const props = this.props;
      const params = queryString.parse(window.location.search);

      if (!process.env.NF_ISSUERS_SECRET || params.etoSecret === process.env.NF_ISSUERS_SECRET) {
        return <Component {...props} />;
      }

      return <Redirect to={appRoutes.root} />;
    }
  };
const EtoSecretProtectedWalletSelector = SecretProtected(WalletSelector);

export { EtoSecretProtectedWalletSelector };
