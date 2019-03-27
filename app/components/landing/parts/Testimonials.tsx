import * as React from "react";
import Slider, { Settings } from "react-slick";
import { Col, Container, Row } from "reactstrap";

import { ExternalLink } from "../../shared/links";
import { JoinCta } from "./JoinCta.unsafe";
import { PeopleSlider } from "./testimonials/People";

import * as christopheImage from "../../../assets/img/landing/testimonials/media/christophe.png";
import * as crowdfundinsiderImage from "../../../assets/img/landing/testimonials/media/crowdfundinsider.png";
import * as fabianImage from "../../../assets/img/landing/testimonials/media/Fabian.png";
import * as frankImage from "../../../assets/img/landing/testimonials/media/Frank.png";
import * as reutersImage from "../../../assets/img/landing/testimonials/media/reuters.png";
import * as techCrunchImage from "../../../assets/img/landing/testimonials/media/techcrunch.png";
import * as styles from "./Testimonials.module.scss";

const settings: Settings = {
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  arrows: false,
};

export const Testimonials: React.FunctionComponent = () => (
  <section>
    <Container>
      <Row>
        <Col xs={12} md={8} className={styles.media}>
          <Slider {...settings}>
            <MediaQuote
              imageSrc={crowdfundinsiderImage}
              link="https://www.crowdfundinsider.com/2018/04/132652-zoe-adamovicz-neufund-is-going-to-be-a-game-changer/"
              quote="The Neufund platform bridges the gap between investors and inventors, and at the same time aligns their interests in a whole new way. "
            />
            <MediaQuote
              imageSrc={techCrunchImage}
              link="https://techcrunch.com/2017/01/17/neufund/"
              quote="The blockchain-based platform that Neufund is building creates a new type of ownership that is neither money nor stock, but crypto tokens which represent equity and at the same time are as liquid as a currency."
            />
            <MediaQuote
              imageSrc={reutersImage}
              link="https://www.reuters.com/article/us-neufund-blockchain-funding/berlin-start-up-raises-nearly-12-million-to-create-equity-token-idUSKBN1D72H9?il=0"
              quote="Neufund’s platform will allow investors to finance projects, while acquiring equity in the form of tradable crypto-currencies."
            />
            <MediaQuote
              imageSrc={christopheImage}
              quote="Europe needs more innovation. When I see Neufund, it's a platform to finance innovation. I believe that it could have a huge impact on the ecosystem, and I think Neufund is gonna be huge."
              author="Christophe Maire, Founder and CEO, Atlantic labs"
            />
            <MediaQuote
              imageSrc={fabianImage}
              quote="I am excited that Neufund is bringing together equity and Blockchain. I expect in the future every company will be tokenized and the way the Neufund platform is build, is the right approach to ignite that."
              author="Fabian Vogelsteller, Developer, Ethereum and Mist"
            />
            <MediaQuote
              imageSrc={frankImage}
              quote="Neufund’s ETOs are changing the space by offering direct, transparent and, most importantly,  legally binding investment rounds on the blockchain, which is an attractive proposition to both companies and investors."
              author="Frank Thelen, Founding Partner at Freigeist VC"
            />
          </Slider>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <h2 className={styles.header}>Become a member of a progressive investor community</h2>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <PeopleSlider />
        </Col>
      </Row>

      <Row className="align-self-center my-5">
        <Col xs={12}>
          <JoinCta className="justify-content-center" />
        </Col>
      </Row>
    </Container>
  </section>
);

interface IMediaQuoteProps {
  imageSrc: string;
  quote: string;
  link?: string;
  author?: string;
}

const MediaQuote: React.FunctionComponent<IMediaQuoteProps> = ({
  imageSrc,
  quote,
  link,
  author,
}) => (
  <ExternalLink href={link} className={styles.mediaQuote}>
    <Row className="justify-content-around">
      <Col className="align-self-center" xs={12} md={4}>
        <img src={imageSrc} className={styles.mediaQuoteImage} />
      </Col>
      <Col className="align-self-center" xs={12} md={8}>
        <blockquote className={styles.mediaQuoteText}>
          {`"${quote}"`}
          {author && ` - ${author}`}
        </blockquote>
      </Col>
    </Row>
  </ExternalLink>
);
