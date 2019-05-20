import { connect } from "formik";
import * as React from "react";
import { compose } from "recompose";
import * as Yup from "yup";

import {
  getFormFractionDoneCalculator,
  IProgressOptions,
  ProgressCalculator,
} from "../../../modules/eto-flow/utils";
import { TFormikConnect } from "../../../types";
import { Form } from "../../shared/forms/Form";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { Section } from "./Shared";

import * as styles from "./EtoFormBase.module.scss";

interface IProps {
  title: string | React.ReactNode;
  "data-test-id"?: string;
}

interface IFormPercentageDoneProps {
  validator: Yup.Schema<any>;
  progressOptions?: IProgressOptions;
}

type TProps = IFormPercentageDoneProps & TFormikConnect;

class PercentageFormDoneLayout extends React.Component<TProps> {
  calculate: ProgressCalculator = getFormFractionDoneCalculator(
    this.props.validator,
    this.props.progressOptions,
  );

  shouldComponentUpdate(nextProps: Readonly<TProps>): boolean {
    // Only rerender when errors number differs
    return (
      Object.keys(this.props.formik.errors).length !== Object.keys(nextProps.formik.errors).length
    );
  }

  render(): React.ReactNode {
    const calculatedFraction = this.calculate(this.props.formik.values);

    return (
      <PercentageIndicatorBar className={styles.progressBar} percent={calculatedFraction * 100} />
    );
  }
}

const PercentageFormDone = compose<TProps, IFormPercentageDoneProps>(connect)(
  PercentageFormDoneLayout,
);

export const EtoFormBase: React.FunctionComponent<IProps & IFormPercentageDoneProps> = ({
  children,
  title,
  validator,
  progressOptions,
  "data-test-id": dataTestId,
}) => (
  <Form className={styles.form} data-test-id={dataTestId}>
    <h4 className={styles.header}>{title}</h4>

    <Section>
      <PercentageFormDone validator={validator} progressOptions={progressOptions} />
    </Section>

    {children}
  </Form>
);
