import { FieldArray, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";

import * as closeIcon from "../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../assets/img/inline_icons/round_plus.svg";
import { CommonHtmlProps } from "../../types";
import { ButtonIcon } from "./Buttons";
import { FormField } from "./forms/formField/FormField";

interface ISingleMediaLinkFieldInternalProps {
  isLastElement?: boolean;
  isFirstElement: boolean;
  formFieldKey: string;
  onAddClick: () => void;
  onRemoveClick: () => void;
  name: string;
  url?: string;
}

const SingleMediaLinkField: React.SFC<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const { isFirstElement, onAddClick, onRemoveClick, isLastElement } = props;

  return (
    <Row className="my-4">
      <Col xs={1}>{isLastElement && <ButtonIcon svgIcon={plusIcon} onClick={onAddClick} />}</Col>
      <Col xs={10}>
        <FormField
          name={`${props.name}.url`}
          label={<FormattedMessage id="shared-component.media-links-editor.url" />}
          placeholder="url"
        />
        <FormField
          name={`${props.name}.title`}
          label={<FormattedMessage id="shared-component.media-links-editor.title" />}
          placeholder="title"
        />
      </Col>
      {!isFirstElement && (
        <Col xs={1}>
          <span className="pt-2">
            <ButtonIcon svgIcon={closeIcon} onClick={onRemoveClick} />
          </span>
        </Col>
      )}
    </Row>
  );
};

interface IProps {
  name: string;
  placeholder: string;
  blankField: object;
}

export class MediaLinksEditor extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  componentDidMount(): void {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const { name } = this.props;
    if (!values[name]) setFieldValue(`${name}.0`, this.props.blankField);
  }

  render(): React.ReactNode {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;

    const { name, blankField } = this.props;
    const mediaLinks: object[] = values[name] || [blankField];
    return (
      <FieldArray
        name={name}
        render={arrayHelpers =>
          mediaLinks.map((_: object, index: number) => {
            const isLastElement = !(index < mediaLinks.length - 1);
            const isFirstElement = index === 0;
            return (
              <>
                <SingleMediaLinkField
                  name={`${name}.${index}`}
                  formFieldKey={"url"}
                  onRemoveClick={() => {
                    arrayHelpers.remove(index);
                  }}
                  onAddClick={() => {
                    setFieldValue(`${name}.${index + 1}`, blankField);
                  }}
                  isFirstElement={isFirstElement}
                  isLastElement={isLastElement}
                />
              </>
            );
          })
        }
      />
    );
  }
}
