import { IEtoOfferingProps } from "../components/landing/EtoOfferingCard";

import * as agora from "../assets/img/eto_offers/agora.jpg";
import * as agora2 from "../assets/img/eto_offers/agora@2x.jpg";
import * as agorahover from "../assets/img/eto_offers/agorahover@1x.jpg";
import * as agora2hover from "../assets/img/eto_offers/agorahover@2x.jpg";
import * as airprofile from "../assets/img/eto_offers/airprofile.jpg";
import * as airprofile2 from "../assets/img/eto_offers/airprofile@2x.jpg";
import * as airprofilehover from "../assets/img/eto_offers/airprofilehover@1x.jpg";
import * as airprofile2hover from "../assets/img/eto_offers/airprofilehover@2x.jpg";
import * as emflux from "../assets/img/eto_offers/emflux.jpg";
import * as emfluxhover from "../assets/img/eto_offers/emfluxhover@1x.jpg";
import * as emflux2hover from "../assets/img/eto_offers/emfluxhover@2x.jpg";
import * as myswoop from "../assets/img/eto_offers/myswoop.jpg";
import * as myswoop2 from "../assets/img/eto_offers/myswoop@2x.jpg";
import * as myswoopbadge from "../assets/img/eto_offers/myswoopbadge@1x.jpg";
import * as myswoopbadge2 from "../assets/img/eto_offers/myswoopbadge@2x.jpg";
import * as myswoophover from "../assets/img/eto_offers/myswoophover@1x.jpg";
import * as myswoop2hover from "../assets/img/eto_offers/myswoophover@2x.jpg";
import * as ngrave from "../assets/img/eto_offers/ngrave.jpg";
import * as ngrave2 from "../assets/img/eto_offers/ngrave@2x.jpg";
import * as ngravehover from "../assets/img/eto_offers/ngravehover@1x.jpg";
import * as ngrave2hover from "../assets/img/eto_offers/ngravehover@2x.jpg";

export const etoCompaniesCards: IEtoOfferingProps[] = [
  {
    roundName: "series a",
    tags: [
      {
        text: "mobility",
        layout: "ghost-bold",
        theme: "white",
      },
      {
        text: "india",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    name: "EMFLUX MOTORS",
    description:
      "Electric superbike changing the landscape of transportation & mobility. India-based venture backed by both crypto and traditional investors with a mission to power 10 million electric bikes in India by 2027.",
    quote: {
      text:
        "The Emflux ETO is a great opportunity to finance a game changing team in the Indian electric vehicles space. The company is deploying the Tesla model of moving from high end to mass market vehicles in the humungous Indian two wheeler segment.",
      credits: "Meher Roy, co-founder of Chorus One and host at Epicenter.tv",
    },
    topImage: {
      srcSet: {
        "1x": emflux,
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      srcSet: {
        "1x": emfluxhover,
        "2x": emflux2hover,
      },
      alt: "",
      height: 35,
      width: 100,
    },
    to: "http://www.emfluxmotors.com/",
  },
  {
    roundName: "series b",
    tags: [
      {
        text: "re-commerce",
        layout: "ghost-bold",
        theme: "white",
      },
      {
        text: "germany",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    name: "mySWOOOP",
    description:
      "Omni-Channel re-commerce platform buying and selling new and used electronics. With tailored software technology, mySWOOOP automatically determines current market prices in real-time assuring attractive resale-margins.",
    quote: {
      text:
        "mySWOOOP performing an innovative trading approach is a key role in our digital agenda. We’re impressed by an average annual sales growth of more than 170% that generated net sales of 4.6 Million in 2017 and we’re looking forward to support growth strategy in 2018.",
      credits: "Rainer Wohlers, Melchers Group",
    },
    topImage: {
      srcSet: {
        "1x": myswoop,
        "2x": myswoop2,
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      srcSet: {
        "1x": myswoophover,
        "2x": myswoop2hover,
      },
      alt: "",
      height: 35,
      width: 100,
    },
    badge: {
      srcSet: {
        "1x": myswoopbadge,
        "2x": myswoopbadge2,
      },
      alt: "",
      height: 81,
      width: 71,
    },
    to: "http://www.myswooop.de/",
  },
  {
    roundName: "seed",
    tags: [
      {
        text: "cleantech",
        layout: "ghost-bold",
        theme: "white",
      },
      {
        text: "renewables",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    name: "AIR PROFILE",
    description:
      "Based on a new patented technology for detecting precise wind speeds, Air Profile boosts the energy transition all over the world. The device simplifies the wind resource assessment for each and every wind farm project worldwide.",
    quote: {
      text: "",
      credits: "",
    },
    topImage: {
      srcSet: {
        "1x": airprofile,
        "2x": airprofile2,
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      srcSet: {
        "1x": airprofilehover,
        "2x": airprofile2hover,
      },
      alt: "",
      height: 270,
      width: 530,
    },
    to: "https://www.air-profile.com/",
  },
  {
    roundName: "series a",
    tags: [
      {
        text: "blockchain",
        layout: "ghost-bold",
        theme: "white",
      },
      {
        text: "exchange",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    name: "AGORA TRADE",
    description:
      "Agora.Trade sets a new security and usability standard for cryptocurrency exchanges. Its decentralized nature gives control over assets back to users. The goal is to establish Agora.Trade as the highest exchange volume.",
    quote: {
      text: "",
      credits: "",
    },
    topImage: {
      srcSet: {
        "1x": agora,
        "2x": agora2,
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      srcSet: {
        "1x": agorahover,
        "2x": agora2hover,
      },
      alt: "",
      height: 270,
      width: 530,
    },
    to: "https://agora.trade/",
  },
  {
    roundName: "seed",
    tags: [
      {
        text: "blockchain",
        layout: "ghost-bold",
        theme: "white",
      },
      {
        text: "wallet",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    name: "NGRAVE",
    description:
      "Next gen cryptocurrency hardware wallet developed with one sole focus: no compromise on security. Create, manage, and initiate transactions with your Ngrave wallet fully offline without the need to expose it to a physical or network connection.",
    quote: {
      text: "",
      credits: "",
    },
    topImage: {
      srcSet: {
        "1x": ngrave,
        "2x": ngrave2,
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      srcSet: {
        "1x": ngravehover,
        "2x": ngrave2hover,
      },
      alt: "",
      height: 270,
      width: 530,
    },
    to: "https://www.ngrave.io",
  },
  {
    tags: [
      {
        text: "biotech",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    description:
      "German biotech startup introducing precision prevention with DNA healthcare applications. Featuring genome sequencing technologies.",
    topImage: {
      src: "",
      srcSet: {
        "1x": "",
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      src: "",
      srcSet: {
        "1x": "",
      },
      alt: "",
      height: 35,
      width: 100,
    },
    teaser: true,
    hidden: true,
  },
  {
    tags: [
      {
        text: "blockchain",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    description:
      "Fintech developing solutions for transacting fiat currencies over blockchains – Smart Money. Coming to Ethereum in 2018.",
    topImage: {
      src: "",
      srcSet: {
        "1x": "",
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      src: "",
      srcSet: {
        "1x": "",
      },
      alt: "",
      height: 50,
      width: 100,
    },
    teaser: true,
    hidden: true,
  },
  {
    tags: [
      {
        text: "energy",
        layout: "ghost-bold",
        theme: "white",
      },
    ],
    description:
      "Creating renewable energy solutions for a clean and sustainable world. Algorithm-based technology utilizing waste.",
    quote: {
      text:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
      credits: "John",
    },
    topImage: {
      src: "",
      srcSet: {
        "1x": "",
      },
      alt: "",
      height: 50,
      width: 100,
    },
    quoteImage: {
      src: "",
      srcSet: {
        "1x": "",
      },
      alt: "",
      height: 35,
      width: 100,
    },
    teaser: true,
    hidden: true,
  },
];
