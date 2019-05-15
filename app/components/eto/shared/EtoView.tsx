import * as cn from "classnames";
import { some } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { TSocialChannelsType } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { selectEtoSubState } from "../../../modules/eto/selectors";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContract,
} from "../../../modules/eto/types";
import { isOnChain } from "../../../modules/eto/utils";
import { appConnect } from "../../../store";
import { withMetaTags } from "../../../utils/withMetaTags.unsafe";
import { icoMonitorEtoLink } from "../../appRouteUtils";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { WidgetGridLayout } from "../../layouts/Layout";
import { PersonProfileModal } from "../../modals/PersonProfileModal";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { ButtonLink } from "../../shared/buttons";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut.unsafe";
import { ExternalLink } from "../../shared/links";
import { ILink, MediaLinksWidget, normalizedUrl } from "../../shared/MediaLinksWidget";
import { Panel } from "../../shared/Panel";
import { IPerson, PeopleSwiperWidget } from "../../shared/PeopleSwiperWidget.unsafe";
import { Slides } from "../../shared/Slides";
import { IEtoSocialProfile, SocialProfilesList } from "../../shared/SocialProfilesList";
import { TabContent, Tabs } from "../../shared/Tabs";
import { TwitterTimelineEmbed } from "../../shared/TwitterTimeline";
import { Video } from "../../shared/Video";
import { EtoOverviewStatus } from "../overview/EtoOverviewStatus";
import { EtoTimeline } from "../overview/EtoTimeline";
import { Cover } from "../public-view/Cover";
import { DocumentsWidget } from "../public-view/DocumentsWidget";
import { EtoInvestmentTermsWidget } from "../public-view/EtoInvestmentTermsWidget";
import { LegalInformationWidget } from "../public-view/LegalInformationWidget";
import { DashboardHeading } from "./DashboardHeading";
import { areThereIndividuals, selectActiveCarouselTab } from "./EtoView.utils";

import * as styles from "./EtoView.module.scss";

const DEFAULT_PLACEHOLDER = "N/A";

export const CHART_COLORS = ["#50e3c2", "#2fb194", "#4a90e2", "#0b0e11", "#394652", "#c4c5c6"];
export const DEFAULT_CHART_COLOR = "#c4c5c6";

interface IProps {
  eto: TEtoWithCompanyAndContract;
  etoPreview: TEtoWithCompanyAndContract;
}

interface IInternalProps {
  eto: TEtoWithCompanyAndContract;
}

interface IStateProps {
  etoSubState: EEtoSubState | undefined;
}
// TODO: There are lots of castings right now in this file, cause formerly the types of IProps was "any"
// The castings should be resolved when the EtoApi.interface.ts reflects the correct data types from swagger!

// TODO: Refactor to smaller components
const EtoViewLayout: React.FunctionComponent<IProps & IStateProps> = ({ eto, etoSubState }) => {
  const {
    advisors,
    companyDescription,
    keyQuoteInvestor,
    socialChannels,
    companyVideo,
    categories,
    disableTwitterFeed,
    companySlideshare,
    brandName,
    companyOneliner,
    companyLogo,
    companyWebsite,
    companyBanner,
    team,
    boardMembers,
    keyAlliances,
    keyCustomers,
    partners,
    notableInvestors,
    keyBenefitsForInvestors,
    targetMarketAndIndustry,
    roadmap,
    marketingApproach,
    useOfCapitalList,
    inspiration,
    companyMission,
    marketTraction,
    problemSolved,
    productVision,
    customerGroup,
    sellingProposition,
    keyCompetitors,
    companyNews,
    marketingLinks,
    businessModel,
    useOfCapital,
  } = eto.company;

  const isTwitterFeedEnabled =
    some<TSocialChannelsType[0]>(
      socialChannels,
      channel => channel.type === "twitter" && !!channel.url && !!channel.url.length,
    ) && !disableTwitterFeed;
  const isYouTubeVideoAvailable = !!(companyVideo && companyVideo.url);
  const isSlideShareAvailable = !!(companySlideshare && companySlideshare.url);
  const hasSocialChannelsAdded = !!(socialChannels && socialChannels.length);
  const twitterUrl =
    isTwitterFeedEnabled && socialChannels
      ? socialChannels.find(c => c.type === "twitter") &&
        socialChannels.find(c => c.type === "twitter")!.url
      : "";

  const isInSetupState = isOnChain(eto) && eto.contract.timedState === EETOStateOnChain.Setup;
  return (
    <>
      <PersonProfileModal />
      <WidgetGridLayout data-test-id="eto.public-view">
        <Cover
          companyName={brandName}
          companyOneliner={companyOneliner}
          companyLogo={{
            alt: brandName,
            srcSet: {
              "1x": companyLogo as string,
            },
          }}
          companyBanner={{
            alt: brandName,
            srcSet: {
              "1x": companyBanner as string,
            },
          }}
          tags={categories}
        />
        <EtoOverviewStatus eto={eto} publicView={true} />
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <DashboardHeading
            title={
              <div className={styles.headerWithButton}>
                <FormattedMessage id="eto.public-view.eto-timeline" />
                {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" && !isInSetupState && (
                  <ButtonLink to={icoMonitorEtoLink(eto.etoId)} target="_blank">
                    <FormattedMessage id="eto.public-view.fundraising-statistics-button" />
                  </ButtonLink>
                )}
              </div>
            }
          />
          <Panel>
            <EtoTimeline
              subState={etoSubState}
              currentState={isOnChain(eto) ? eto.contract.timedState : undefined}
              startOfStates={isOnChain(eto) ? eto.contract.startOfStates : undefined}
            />
          </Panel>
        </Container>
        <Container
          columnSpan={
            isSlideShareAvailable ||
            isTwitterFeedEnabled ||
            isYouTubeVideoAvailable ||
            hasSocialChannelsAdded
              ? EColumnSpan.TWO_COL
              : EColumnSpan.THREE_COL
          }
        >
          <Container columnSpan={EColumnSpan.TWO_COL}>
            <DashboardHeading
              title={
                <div className={styles.headerWithButton}>
                  {brandName}
                  {companyWebsite && (
                    <ExternalLink href={normalizedUrl(companyWebsite)}>
                      {companyWebsite.split("//")[1] || DEFAULT_PLACEHOLDER}
                    </ExternalLink>
                  )}
                </div>
              }
            />

            {(companyDescription || keyQuoteInvestor) && (
              <Panel columnSpan={EColumnSpan.TWO_COL}>
                {companyDescription && <p className="mb-4">{companyDescription}</p>}
                {keyQuoteInvestor && <p className={cn(styles.quote, "mb-4")}>{keyQuoteInvestor}</p>}
              </Panel>
            )}
          </Container>
          <Container columnSpan={EColumnSpan.TWO_COL}>
            <DashboardHeading
              title={<FormattedMessage id="eto.public-view.legal-information.title" />}
            />
            <LegalInformationWidget companyData={eto.company} columnSpan={EColumnSpan.THREE_COL} />
          </Container>
        </Container>
        {(isYouTubeVideoAvailable || isSlideShareAvailable) && (
          <Container columnSpan={EColumnSpan.ONE_COL}>
            <Container>
              <Tabs layoutSize="large" layoutOrnament={false}>
                {isYouTubeVideoAvailable && (
                  <TabContent tab="video">
                    <Video youTubeUrl={companyVideo && companyVideo.url} hasModal />
                  </TabContent>
                )}
                {isSlideShareAvailable && (
                  <TabContent tab="pitch deck">
                    <Slides slideShareUrl={companySlideshare && companySlideshare.url} />
                  </TabContent>
                )}
              </Tabs>
            </Container>
            <Container>
              <div
                className={cn(
                  (isSlideShareAvailable || isTwitterFeedEnabled || isYouTubeVideoAvailable) &&
                    "mt-4",
                )}
              >
                <SocialProfilesList profiles={(socialChannels as IEtoSocialProfile[]) || []} />
              </div>
            </Container>
            {isTwitterFeedEnabled && (
              <Container>
                <DashboardHeading
                  title={<FormattedMessage id={"eto.public-view.twitter-feed"} />}
                />
                <Panel>
                  <TwitterTimelineEmbed url={twitterUrl!} userName={brandName} />
                </Panel>
              </Container>
            )}
          </Container>
        )}
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <DashboardHeading title={<FormattedMessage id="eto.public-view.token-terms.title" />} />
          <EtoInvestmentTermsWidget etoData={eto} />
        </Container>
        {areThereIndividuals(team) && (
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={<FormattedMessage id="eto.public-view.carousel.team" />} />
            <Panel>
              <PeopleSwiperWidget
                people={(team && (team.members as IPerson[])) || []}
                key={"team"}
              />
            </Panel>
          </Container>
        )}
        {(areThereIndividuals(advisors) ||
          areThereIndividuals(notableInvestors) ||
          areThereIndividuals(partners) ||
          areThereIndividuals(keyCustomers) ||
          areThereIndividuals(keyAlliances) ||
          areThereIndividuals(boardMembers)) && (
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <Tabs
              className="mb-3"
              layoutSize="large"
              layoutOrnament={false}
              selectedIndex={selectActiveCarouselTab([
                advisors,
                notableInvestors,
                partners,
                keyCustomers,
                boardMembers,
                keyAlliances,
              ])}
            >
              {areThereIndividuals(advisors) && (
                <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.advisors" />}>
                  <Panel>
                    <PeopleSwiperWidget people={advisors.members as IPerson[]} key={"team"} />
                  </Panel>
                </TabContent>
              )}
              {areThereIndividuals(notableInvestors) && (
                <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.investors" />}>
                  <Panel>
                    <PeopleSwiperWidget
                      people={notableInvestors.members as IPerson[]}
                      key="notableInvestors"
                    />
                  </Panel>
                </TabContent>
              )}
              {areThereIndividuals(partners) && (
                <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.partners" />}>
                  <Panel>
                    <PeopleSwiperWidget people={partners.members as IPerson[]} key="partners" />
                  </Panel>
                </TabContent>
              )}
              {areThereIndividuals(keyCustomers) && (
                <TabContent
                  tab={<FormattedMessage id="eto.public-view.carousel.tab.key-customers" />}
                >
                  <Panel>
                    <PeopleSwiperWidget
                      key="keyCustomers"
                      people={keyCustomers.members as IPerson[]}
                    />
                  </Panel>
                </TabContent>
              )}
              {areThereIndividuals(boardMembers) && (
                <TabContent
                  tab={<FormattedMessage id="eto.public-view.carousel.tab.board-members" />}
                >
                  <Panel>
                    <PeopleSwiperWidget
                      key="boardMembers"
                      people={boardMembers.members as IPerson[]}
                    />
                  </Panel>
                </TabContent>
              )}
              {areThereIndividuals(keyAlliances) && (
                <TabContent
                  tab={<FormattedMessage id="eto.public-view.carousel.tab.key-alliances" />}
                >
                  <Panel>
                    <PeopleSwiperWidget
                      key="keyAlliances"
                      people={keyAlliances.members as IPerson[]}
                    />
                  </Panel>
                </TabContent>
              )}
            </Tabs>
          </Container>
        )}
        <Container columnSpan={EColumnSpan.TWO_COL} type={EContainerType.INHERIT_GRID}>
          <Container columnSpan={EColumnSpan.TWO_COL}>
            {(inspiration ||
              companyMission ||
              customerGroup ||
              productVision ||
              problemSolved ||
              marketTraction ||
              keyCompetitors ||
              sellingProposition ||
              useOfCapitalList ||
              marketingApproach ||
              roadmap ||
              targetMarketAndIndustry ||
              keyBenefitsForInvestors) && (
              <>
                <DashboardHeading
                  title={<FormattedMessage id="eto.public-view.product-vision.title" />}
                />
                <Panel>
                  <Accordion>
                    {inspiration && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.inspiration" />}
                      >
                        <p>{inspiration}</p>
                      </AccordionElement>
                    )}
                    {companyMission && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.company-mission" />}
                      >
                        <p>{companyMission}</p>
                      </AccordionElement>
                    )}
                    {productVision && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.product-vision" />}
                      >
                        <p>{productVision}</p>
                      </AccordionElement>
                    )}
                    {problemSolved && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
                      >
                        <p>{problemSolved}</p>
                      </AccordionElement>
                    )}
                    {customerGroup && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.customer-group" />}
                      >
                        <p>{customerGroup}</p>
                      </AccordionElement>
                    )}
                    {targetMarketAndIndustry && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.target-segment" />}
                      >
                        <p>{targetMarketAndIndustry}</p>
                      </AccordionElement>
                    )}
                    {keyCompetitors && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.key-competitors" />}
                      >
                        <p>{keyCompetitors}</p>
                      </AccordionElement>
                    )}
                    {sellingProposition && (
                      <AccordionElement
                        title={
                          <FormattedMessage id="eto.form.product-vision.selling-proposition" />
                        }
                      >
                        <p>{sellingProposition}</p>
                      </AccordionElement>
                    )}
                    {keyBenefitsForInvestors && (
                      <AccordionElement
                        title={
                          <FormattedMessage id="eto.form.product-vision.key-benefits-for-investors" />
                        }
                      >
                        <p>{keyBenefitsForInvestors}</p>
                      </AccordionElement>
                    )}

                    {((useOfCapitalList &&
                      useOfCapitalList.some(e => e && e.percent && e.percent > 0)) ||
                      useOfCapital) && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
                      >
                        {useOfCapital && <p>{useOfCapital}</p>}

                        {useOfCapitalList && (
                          <ChartDoughnut
                            className={styles.doughnut}
                            layout="vertical"
                            data={{
                              datasets: [
                                {
                                  data: useOfCapitalList.map(d => d && d.percent) as number[],
                                  backgroundColor: useOfCapitalList.map(
                                    (_, i: number) => CHART_COLORS[i],
                                  ),
                                },
                              ],
                              labels: (useOfCapitalList || []).map(
                                d => d && d.description,
                              ) as string[],
                            }}
                          />
                        )}
                      </AccordionElement>
                    )}
                    {marketTraction && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.market-traction" />}
                      >
                        <p>{marketTraction}</p>
                      </AccordionElement>
                    )}
                    {roadmap && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.roadmap" />}
                      >
                        <p>{roadmap}</p>
                      </AccordionElement>
                    )}
                    {businessModel && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.business-model" />}
                      >
                        <p>{businessModel}</p>
                      </AccordionElement>
                    )}
                    {marketingApproach && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
                      >
                        <p>{marketingApproach}</p>
                      </AccordionElement>
                    )}
                  </Accordion>
                </Panel>
              </>
            )}
          </Container>
        </Container>

        <Container columnSpan={EColumnSpan.ONE_COL} type={EContainerType.INHERIT_GRID}>
          {marketingLinks && (
            <Container columnSpan={EColumnSpan.ONE_COL}>
              <DashboardHeading title={<FormattedMessage id="eto.form.documents.title" />} />
              <DocumentsWidget
                columnSpan={EColumnSpan.THREE_COL}
                companyMarketingLinks={marketingLinks}
                etoTemplates={eto.templates}
                etoDocuments={eto.documents}
                offeringDocumentType={eto.product.offeringDocumentType}
              />
            </Container>
          )}

          {companyNews && !!companyNews[0].url && (
            <Container columnSpan={EColumnSpan.ONE_COL}>
              <DashboardHeading title={<FormattedMessage id="eto.form.media-links.title" />} />
              <MediaLinksWidget
                links={[...companyNews].reverse() as ILink[]}
                columnSpan={EColumnSpan.THREE_COL}
              />
            </Container>
          )}
        </Container>
      </WidgetGridLayout>
    </>
  );
};

const EtoView = compose<IStateProps & IProps, IProps>(
  appConnect<IStateProps, {}, IProps>({
    stateToProps: (state, props) => ({
      etoSubState: selectEtoSubState(state, props.eto.previewCode),
    }),
  }),
  withMetaTags<IProps>(({ eto }, intl) => {
    const requiredDataPresent =
      eto.company.brandName && eto.equityTokenName && eto.equityTokenSymbol;

    return {
      title: requiredDataPresent
        ? `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
        : intl.formatIntlMessage("menu.eto-page"),
    };
  }),
)(EtoViewLayout);

export const MultiEtoView: React.FunctionComponent<IProps> = ({ eto, etoPreview }) => (
  <Tabs layoutSize="large" layoutOrnament={false} layoutPosition="center">
    <TabContent tab="In Draft">
      <SingleEtoView eto={etoPreview} />
    </TabContent>
    <TabContent tab="Published">
      <SingleEtoView eto={eto} />
    </TabContent>
  </Tabs>
);

export { EtoViewLayout, SingleEtoView };
