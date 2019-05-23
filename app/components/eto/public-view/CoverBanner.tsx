import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { selectUserType } from "../../../modules/auth/selectors";
import { selectIssuerEtoPreviewCode } from "../../../modules/eto-flow/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { selectBaseUrl } from "../../../utils/locationUtils";
import { Container, EColumnSpan } from "../../layouts/Container";

import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as styles from "./CoverBanner.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
  isInvestorView: boolean;
}

interface IBaseProps {
  dataTestId?: string;
}

interface IJurisdictionBannerProps {
  jurisdiction?: EJurisdiction;
}

interface IInvestorPreviewProps {
  previewCode?: string;
  origin: string;
}

type TBannerProps = IInvestorPreviewProps | IJurisdictionBannerProps;

const BannerBase: React.FunctionComponent<IBaseProps> = ({ children, dataTestId }) => (
  <Container
    columnSpan={EColumnSpan.THREE_COL}
    className={styles.jurisdictionBanner}
    data-test-id={dataTestId}
  >
    <img src={infoIcon} className={styles.icon} alt="" />
    {children}
  </Container>
);

export const InvestorBannerLayout: React.FunctionComponent<IJurisdictionBannerProps> = ({
  jurisdiction,
}) => {
  switch (jurisdiction) {
    case EJurisdiction.GERMANY:
      return (
        <BannerBase dataTestId={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
          <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de" />
        </BannerBase>
      );
    case EJurisdiction.LIECHTENSTEIN:
      return (
        <BannerBase dataTestId={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
          <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li" />
        </BannerBase>
      );
    default:
      return null;
  }
};

export const IssuerBannerLayout: React.FunctionComponent<IInvestorPreviewProps> = ({
  previewCode,
  origin,
}) => (
  <BannerBase dataTestId={`eto.public-view.investor-preview-banner`}>
    <FormattedHTMLMessage
      tagName="span"
      id="eto-overview.cover-banner.go-to-investor-view"
      values={{ href: `${origin}/eto/view/${previewCode}` }}
    />
  </BannerBase>
);

export const CoverBanner = compose<TBannerProps, IExternalProps & TBannerProps>(
  appConnect<TBannerProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const userType = selectUserType(state);

      if (userType === EUserType.ISSUER && !props.isInvestorView) {
        return {
          userType,
          origin: selectBaseUrl(),
          previewCode: selectIssuerEtoPreviewCode(state),
        };
      } else {
        return {
          userType,
          jurisdiction: props.eto.product.jurisdiction,
        };
      }
    },
  }),
  branch<{ userType: EUserType; isInvestorView: boolean }>(
    props => props.userType === EUserType.ISSUER && !props.isInvestorView,
    renderComponent(IssuerBannerLayout),
  ),
)(InvestorBannerLayout);
