import * as React from "react";

import { COMPANY_TAGS_LIMIT } from "../../../config/constants";
import { TTranslatedString } from "../../../types";
import { Container, EColumnSpan } from "../../layouts/Container";
import { IResponsiveImage, ResponsiveImage } from "../../shared/ResponsiveImage";
import { Tag } from "../../shared/Tag.unsafe";

import * as styles from "./Cover.module.scss";

interface IProps {
  companyBanner: IResponsiveImage;
  companyName: TTranslatedString;
  companyOneliner: TTranslatedString;
  companyLogo: IResponsiveImage;
  tags: ReadonlyArray<TTranslatedString> | undefined;
}

export const Cover: React.FunctionComponent<IProps> = ({
  companyBanner,
  companyName,
  companyOneliner,
  companyLogo,
  tags = [],
}) => (
  <Container columnSpan={EColumnSpan.THREE_COL} className={styles.cover}>
    <ResponsiveImage
      width={1250}
      height={400}
      srcSet={companyBanner.srcSet}
      alt={companyBanner.alt}
    />

    <div className={styles.companyDetails}>
      <div className={styles.identity}>
        <div className={styles.logo}>
          <ResponsiveImage
            className={styles.logo}
            srcSet={companyLogo.srcSet}
            alt={companyLogo.alt}
            theme="light"
          />
        </div>
        <div className={styles.details}>
          <h2 className={styles.name}>{companyName}</h2>
          <h3 className={styles.shortDescription}>{companyOneliner}</h3>
        </div>
      </div>
      <div className={styles.tags}>
        {tags.slice(0, COMPANY_TAGS_LIMIT).map((tag, index) => (
          <Tag text={tag} className="ml-3" layout="bold" theme="dark" key={index} />
        ))}
      </div>
    </div>
  </Container>
);
