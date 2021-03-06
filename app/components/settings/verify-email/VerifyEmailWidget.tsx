import * as cn from "classnames";
import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";
import * as Yup from "yup";

import { actions } from "../../../modules/actions";
import {
  selectIsThereUnverifiedEmail,
  selectIsUserEmailVerified,
  selectUnverifiedUserEmail,
  selectVerifiedUserEmail,
} from "../../../modules/auth/selectors";
import { selectIsCancelEmail } from "../../../modules/profile/reducer";
import { selectIsConnectedButtonLocked } from "../../../modules/verify-email-widget/reducer";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers.unsafe";
import { EColumnSpan } from "../../layouts/Container";
import { Button, EButtonLayout } from "../../shared/buttons";
import { ButtonArrowRight } from "../../shared/buttons/Button";
import { Form, FormField } from "../../shared/forms";
import { Panel } from "../../shared/Panel";

import * as successIcon from "../../../assets/img/notifications/success.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./VerifyEmailWidget.module.scss";

interface IStateProps {
  isUserEmailVerified: boolean;
  isThereUnverifiedEmail: boolean;
  verifiedEmail?: string;
  unverifiedEmail?: string;
  isLocked?: boolean;
  isEmailTemporaryCancelled: boolean;
}

interface IOwnProps {
  step: number;
  columnSpan?: EColumnSpan;
}

interface IEnhancedFormProps {
  handleSubmit: (values: IFormValues) => void;
  isLocked?: boolean;
  revertCancelEmail: () => void;
  isThereUnverifiedEmail?: boolean;
  verifiedEmail?: string;
}

interface IDispatchProps {
  resendEmail: () => void;
  addNewEmail: (values: { email: string }) => void;
  cancelEmail: () => void;
  revertCancelEmail: () => void;
  abortEmailUpdate: () => void;
}

interface IFormValues {
  email: string;
}

interface INoEMailUser {
  addNewEmail: (values: { email: string }) => void;
  isLocked?: boolean;
  isThereUnverifiedEmail?: boolean;
  revertCancelEmail: () => void;
  verifiedEmail?: string;
}

const showUpdateButton = (verifiedEmail: string | undefined, unverifiedEmail: string | undefined) =>
  (!verifiedEmail && unverifiedEmail) || (verifiedEmail && !unverifiedEmail);
const showUpdateCancelButton = (
  verifiedEmail: string | undefined,
  unverifiedEmail: string | undefined,
) => verifiedEmail && unverifiedEmail;

/**
 * Workaround for: https://github.com/jaredpalmer/formik/issues/621
 */
function isValid(props: FormikProps<IFormValues>): boolean {
  const noErrors = Object.keys(props.errors).length === 0;
  const notEmpty = !!props.values.email;

  return noErrors && notEmpty;
}

const SetEmailForm = injectIntlHelpers<IEnhancedFormProps & FormikProps<IFormValues>>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <Form className={cn("mt-2 pt-0 mb-0")}>
      <FormField
        placeholder={formatIntlMessage("settings.verify-email-widget.email-placeholder")}
        name="email"
        data-test-id="verify-email-widget-form-email-input"
      />
      <div className={cn("d-flex justify-content-end text-center flex-wrap")}>
        {(props.verifiedEmail || props.isThereUnverifiedEmail) && (
          <Button
            data-test-id="verify-email-widget-form-cancel"
            layout={EButtonLayout.SECONDARY}
            onClick={props.revertCancelEmail}
          >
            <FormattedMessage id="form.button.cancel" />
          </Button>
        )}
        <Button
          type="submit"
          layout={EButtonLayout.SECONDARY}
          disabled={!isValid(props) || props.isLocked}
          data-test-id="verify-email-widget-form-submit"
        >
          <FormattedMessage id="form.button.submit" />
        </Button>
      </div>
    </Form>
  ),
);

const EmailFormSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
});

const SetEmailEnhancedForm = withFormik<IEnhancedFormProps, IFormValues>({
  validationSchema: EmailFormSchema,
  handleSubmit: (values, props) => props.props.handleSubmit(values),
})(SetEmailForm);

const NoEmailUser: React.FunctionComponent<INoEMailUser> = ({
  addNewEmail,
  isLocked,
  revertCancelEmail,
  isThereUnverifiedEmail,
  verifiedEmail,
}) => (
  <div data-test-id="profile.verify-email-widget.no-email-state" className={styles.noEmailUser}>
    <p>
      <FormattedMessage id="settings.verify-email-widget.enter-email" />
    </p>
    <SetEmailEnhancedForm
      data-test-id={true}
      verifiedEmail={verifiedEmail}
      handleSubmit={addNewEmail}
      isLocked={isLocked}
      revertCancelEmail={revertCancelEmail}
      isThereUnverifiedEmail={isThereUnverifiedEmail}
    />
  </div>
);

const VerifiedUser: React.FunctionComponent<{
  verifiedEmail?: string;
  cancelEmail: () => void;
}> = ({ verifiedEmail, cancelEmail }) => (
  <section
    className={styles.section}
    data-test-id="profile.verify-email-widget.verified-email-state"
  >
    <p className={cn(styles.text, "pt-2")}>
      <FormattedMessage id="settings.verify-email-widget.email-is-verified" />
    </p>
    <p className={styles.emailVerified} data-test-id="email-verified">
      <strong>
        <FormattedMessage id="settings.verify-email-widget.verified-email" />:{" "}
      </strong>
      <span data-test-id="profile.verify-email-widget.verified-email">{verifiedEmail}</span>
    </p>

    <ButtonArrowRight
      className={styles.button}
      data-test-id="verify-email-widget.change-email.button"
      onClick={cancelEmail}
    >
      <FormattedMessage id="settings.verify-email-widget.change-email" />
    </ButtonArrowRight>
  </section>
);

const UnVerifiedUser: React.FunctionComponent<{
  resendEmail: () => void;
  verifiedEmail?: string;
  unverifiedEmail?: string;
  cancelEmail: () => void;
  abortEmailUpdate: () => void;
}> = ({ resendEmail, verifiedEmail, unverifiedEmail, cancelEmail, abortEmailUpdate }) => (
  <section
    className={styles.section}
    data-test-id="profile.verify-email-widget.unverified-email-state"
  >
    {verifiedEmail && (
      <p className="pt-2">
        <strong>
          <FormattedMessage id="settings.verify-email-widget.verified-email" />:{" "}
        </strong>
        <span data-test-id="profile.verify-email-widget.verified-email">{verifiedEmail}</span>
      </p>
    )}
    {unverifiedEmail && (
      <p className={cn(styles.text, "pt-2")}>
        <FormattedMessage id="settings.verify-email-widget.unverified-email" />:{" "}
        <strong data-test-id="profile.verify-email-widget.unverified-email">
          {unverifiedEmail}
        </strong>
      </p>
    )}

    <section className={styles.buttonsContainer}>
      {showUpdateButton(verifiedEmail, unverifiedEmail) && (
        <ButtonArrowRight
          layout={EButtonLayout.SECONDARY}
          onClick={cancelEmail}
          data-test-id="verify-email-widget.change-email.button"
        >
          <FormattedMessage id="settings.verify-email-widget.change-email" />
        </ButtonArrowRight>
      )}
      {showUpdateCancelButton(verifiedEmail, unverifiedEmail) && (
        <ButtonArrowRight
          layout={EButtonLayout.SECONDARY}
          onClick={abortEmailUpdate}
          data-test-id="verify-email-widget.abort-change-email.button"
        >
          <FormattedMessage id="settings.verify-email-widget.abort-change-email" />
        </ButtonArrowRight>
      )}
      <ButtonArrowRight
        layout={EButtonLayout.SECONDARY}
        onClick={resendEmail}
        data-test-id="resend-link"
      >
        <FormattedMessage id="settings.verify-email-widget.resend-link" />
      </ButtonArrowRight>
    </section>
  </section>
);

export const VerifyEmailWidgetComponent: React.FunctionComponent<
  IStateProps & IDispatchProps & IOwnProps & IIntlProps
> = ({
  intl: { formatIntlMessage },
  isUserEmailVerified,
  isThereUnverifiedEmail,
  resendEmail,
  verifiedEmail,
  unverifiedEmail,
  addNewEmail,
  isLocked,
  cancelEmail,
  isEmailTemporaryCancelled,
  step,
  revertCancelEmail,
  abortEmailUpdate,
  columnSpan,
}) => {
  const shouldViewVerifiedUser =
    !isThereUnverifiedEmail && !isEmailTemporaryCancelled && isUserEmailVerified;
  const shouldViewUnVerifiedUser = isThereUnverifiedEmail && !isEmailTemporaryCancelled;
  const shouldViewNoEmail =
    (!isThereUnverifiedEmail && !verifiedEmail) || isEmailTemporaryCancelled;
  return (
    <Panel
      columnSpan={columnSpan}
      headerText={formatIntlMessage("settings.verify-email-widget.header", { step })}
      rightComponent={
        isUserEmailVerified && !isThereUnverifiedEmail ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" alt="" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" alt="" />
        )
      }
      data-test-id="profile.verify-email-widget"
    >
      {shouldViewVerifiedUser && (
        <VerifiedUser {...{ verifiedEmail, cancelEmail }} data-test-id="verified-section" />
      )}
      {shouldViewUnVerifiedUser && (
        <UnVerifiedUser
          {...{
            resendEmail,
            verifiedEmail,
            unverifiedEmail,
            cancelEmail,
            revertCancelEmail,
            abortEmailUpdate,
          }}
          data-test-id="unverified-section"
        />
      )}
      {shouldViewNoEmail && (
        <NoEmailUser
          {...{ addNewEmail, verifiedEmail, isLocked, revertCancelEmail, isThereUnverifiedEmail }}
        />
      )}
    </Panel>
  );
};

export const VerifyEmailWidget = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: s => ({
      isUserEmailVerified: selectIsUserEmailVerified(s.auth),
      isThereUnverifiedEmail: selectIsThereUnverifiedEmail(s.auth),
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      unverifiedEmail: selectUnverifiedUserEmail(s.auth),
      isLocked: selectIsConnectedButtonLocked(s.verifyEmailWidgetState),
      isEmailTemporaryCancelled: selectIsCancelEmail(s.profile),
    }),
    dispatchToProps: dispatch => ({
      resendEmail: () => {
        dispatch(actions.profile.resendEmail());
      },
      addNewEmail: (values: { email: string }) => {
        dispatch(actions.profile.addNewEmail(values.email));
      },
      cancelEmail: () => {
        dispatch(actions.profile.cancelEmail());
      },
      revertCancelEmail: () => dispatch(actions.profile.revertCancelEmail()),
      abortEmailUpdate: () => dispatch(actions.profile.abortEmailUpdate()),
    }),
  }),
  injectIntlHelpers,
)(VerifyEmailWidgetComponent);
