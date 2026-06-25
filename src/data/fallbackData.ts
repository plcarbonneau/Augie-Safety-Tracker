import { Incident, IncidentCategory } from "../types";

export const FALLBACK_INCIDENTS: any[] = [
  {
    id: "e1b12112274d2d8680f8a5267c60680ea",
    date: "2026-06-22",
    time: "9:35 AM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Well Being check",
    description: "CSO and Student affairs conducted a well being check. An incident report was completed.",
    isReported: true
  },
  {
    id: "ed6134c58007f1ff4341586ab5709f7de",
    date: "2026-06-21",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "eb22a160cc66910ec78981ee6642dda73",
    date: "2026-06-20",
    time: "2:05 AM",
    location: "Fryxell Humanities (2120 S Grange Ave)",
    type: "Possession of controlled substance",
    description: "CSO checked on device in student possession. An incident report was completed.",
    isReported: true
  },
  {
    id: "e11e5f3e674a5a671b10918e275335b1e",
    date: "2026-06-19",
    time: "12:38 PM",
    location: "Balcer Apt (2420 S Summit Ave)",
    type: "Fire alarm",
    description: "CSO and SFFR responded to fire in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e18a634f71f6865eba8f27f53acd667b0",
    date: "2026-06-19",
    time: "5:13 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Theft",
    description: "CSO investigated student reported theft in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "ebce7a189d499ebd597ae7b527abe8359",
    date: "2026-06-18",
    time: "2:00 PM",
    location: "Wagoner Hall (2300 S Grange Ave)",
    type: "Theft",
    description: "CSO investigated student reported theft in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e3ee2125ea528d9f4e6688fbbc27d1594",
    date: "2026-06-17",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e343b192fc99b6a65ca89823f038a84cf",
    date: "2026-06-16",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e76fccccc9a704df8d6f964039935a3ba",
    date: "2026-06-15",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e0d5456d481d30d7a99477f34586cafd2",
    date: "2026-06-14",
    time: "1:50 AM",
    location: "Nelson Apartment (2320 S Summit Ave)",
    type: "Fire safety violation",
    description: "CSO investigated trouble in system. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4bf76f2653482040fe6a771d4248ef99",
    date: "2026-06-13",
    type: "Nothing to report",
    time: "",
    location: "Campus-wide",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e3e7e918bc727ff5d404079f8eaad6470",
    date: "2026-06-12",
    time: "9:38 AM",
    location: "Fryxell Humanities Center (2120 S Grange Ave)",
    type: "Medical response",
    description: "CSO responded to a medical request. An incident report was completed.",
    isReported: true
  },
  {
    id: "e566b115cd95f62409619ab6a9eba225b",
    date: "2026-06-11",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e74e4502cc4fe93d87d845279423bf2cc",
    date: "2026-06-10",
    time: "12:14 AM",
    location: "University Dr.",
    type: "Suspicious Vehicle",
    description: "CSO investigated vehicle driving around campus. An incident report was completed.",
    isReported: true
  },
  {
    id: "ed618189d7794ce21272311258ae9e0f2",
    date: "2026-06-10",
    time: "1:30 AM",
    location: "Nelson Apartments (2320 S Summit Ave)",
    type: "Narcotics",
    description: "CSO investigated smell in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "ee2a6e148ed1d1b33a2027f0e34409a9e",
    date: "2026-06-09",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e5a8c78725d0a3c541bf88392d47beb0a",
    date: "2026-06-08",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "eddd7dd7fd2e50f9becc8192f33ca2067",
    date: "2026-06-07",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e4bba5767b9d5c8ab076bbf2e1ff5b677",
    date: "2026-06-06",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e9aae589cb84e5b22d0f4c99910bc504c",
    date: "2026-06-05",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e7d2cd5cbd50ccebbe21ebce98367b03c",
    date: "2026-06-04",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e911e970028f16570f4d848852854bd44",
    date: "2026-06-03",
    time: "10:25 AM",
    location: "Stavig Hall (2008 S Walts Ave)",
    type: "Narcotics violation",
    description: "CSO investigated report of narcotics found in room. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec09375ac78c5a96b6bde2c2458999686",
    date: "2026-06-02",
    time: "2:26 PM",
    location: "Midco Arena",
    type: "Damaged property",
    description: "CSO investigated report of damage to property. An incident report was completed.",
    isReported: true
  },
  {
    id: "edfa6adc617597110868bcc759af7fb7f",
    date: "2026-06-02",
    time: "9:45 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Medical response",
    description: "CSO responded to request for medical aid. An incident report was completed.",
    isReported: true
  },
  {
    id: "ea939a7b7a55d588e8bd0088261b15f8e",
    date: "2026-06-01",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e9b5c6935a8f5ed52441d5a41a45db16d",
    date: "2026-05-31",
    time: "2:04 AM",
    location: "Svendsbye Apt (2410 S Summit Apt)",
    type: "Disorderly Conduct",
    description: "CSO investigated subjects behind building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e46fabcbb22f17410461a0b2aac84941e",
    date: "2026-05-31",
    time: "2:15 PM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Scam",
    description: "CSO spoke to student about suspected scam. An incident report was completed.",
    isReported: true
  },
  {
    id: "e6195b9b552316b7054e858ccceadd00b",
    date: "2026-05-30",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e2bfd90fdea58388b309ff5340b072d49",
    date: "2026-05-29",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e6ab80ac4e61be6c89dc66b99c1c58fc4",
    date: "2026-05-28",
    time: "5:18 AM",
    location: "Mikkelsen Library (2117 S Summit Ave)",
    type: "Alcohol violation",
    description: "CSO found alcohol outside building. An incident report was completed.",
    isReported: true
  },
  {
    id: "ed9f422f08ae4ca3a3ca11f214afc740e",
    date: "2026-05-27",
    time: "8:10 AM",
    location: "Midco Arena",
    type: "Fire alarm",
    description: "CSO and SFFR investigated issue with building alarm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e844aee20efc4441b0403fc9074cf04fa",
    date: "2026-05-26",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ef1bec1ba1522089f2ab69594e5eace61",
    date: "2026-05-25",
    time: "5:39 PM",
    location: "Midco Arena",
    type: "Fire alarm",
    description: "CSO and SFFR investigated odor in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e5950087ffef920a606b56a64ebadbf66",
    date: "2026-05-25",
    time: "11:19 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Property Damage",
    description: "CSO investigated damage to building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e67d6deb775833a7d827a3a6227f823d7",
    date: "2026-05-24",
    time: "12:58 AM",
    location: "Granskou Hall (2009 S Prairie Ave)",
    type: "Noise disturbance",
    description: "CSO and Student Affairs checked on a noise complaint. An incident report was completed.",
    isReported: true
  },
  {
    id: "e72873acda927a4de02963a0b45d430c7",
    date: "2026-05-24",
    time: "2:34 AM",
    location: "Balcer Apt (2420 S Summit Apt)",
    type: "Dumpster diver",
    description: "CSO removed subject from area. An incident report was completed.",
    isReported: true
  },
  {
    id: "e24dc20a1c34bf1db2abbb83bd8add45e",
    date: "2026-05-24",
    time: "12:00 PM",
    location: "Bergsaker Dorm",
    type: "Disposal of items",
    description: "CSO investigated loss of item. An incident report was completed.",
    isReported: true
  },
  {
    id: "e7e072f8b4fa6580f1547b3d1fa018212",
    date: "2026-05-24",
    time: "12:45 PM",
    location: "Midco Arena",
    type: "Fire alarm",
    description: "CSO and SFFR investigated odor in building. Building evacuated. An incident report was completed.",
    isReported: true
  },
  {
    id: "eb8770d1178107c3d90d885a3041f98d2",
    date: "2026-05-23",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "eae61b23d083917c89021b96b2aefa7c7",
    date: "2026-05-22",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e65495cc02cf3f0798be0b3560b1f843c",
    date: "2026-05-21",
    time: "11:00 PM", // Est
    location: "Granskou Hall (2009 S. Prairie Ave)",
    type: "Noise Complaint",
    description: "CSO's responded to a noise complaint. Subjects were asked to remain quiet. All subjects were cooperative. An incident report was completed.",
    isReported: true
  },
  {
    id: "e25d5527b5721ace773c1529ed73108d0",
    date: "2026-05-20",
    time: "3:00 PM", // Est
    location: "Bergsaker Hall (1110 W. 33rd St.)",
    type: "Disorderly Conduct",
    description: "CSO confronted a group of juvenile throwing items and driving scoots on university property. The subjects were spoken to a told to leave the property. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec9d81095caeb5deae9b88424f635074d",
    date: "2026-05-19",
    time: "4:00 PM", // Est
    location: "Morrison Commons (2112 S. Grange Ave.)",
    type: "Disorderly Conduct",
    description: "CSO responded to a suspicious subject. The subject was spoken to. An incident report was completed.",
    isReported: true
  },
  {
    id: "e90d74b030b3f7f459122291d45db6c21",
    date: "2026-05-18",
    time: "2:00 PM", // Est
    location: "Elmen Center (2505 S. Grange Ave.)",
    type: "Medical Emergency",
    description: "CSO's responded to a request for medical assistance. EMS responded and transported the subject to the hospital. An incident report was completed.",
    isReported: true
  },
  {
    id: "e94ae93ad58a79453315c378e91e1ca3d",
    date: "2026-05-17",
    time: "3:13 AM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Alcohol violation",
    description: "CSO found alcohol on campus. An incident report was completed.",
    isReported: true
  },
  {
    id: "e0f8aabf667cdd1a9f8951aa39640d910",
    date: "2026-05-16",
    time: "11:48 PM",
    location: "Granskou Hall (2009 S Prairie Ave)",
    type: "Damage to property",
    description: "CSO took a report of damage. An incident report was completed.",
    isReported: true
  },
  {
    id: "e9a8e33c1dac9cc17a3ceae9651e5cea5",
    date: "2026-05-15",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "eaa34cb364edcd485311d1ffbb96b2c08",
    date: "2026-05-14",
    time: "3:25 PM",
    location: "Midco lot",
    type: "Damage to property",
    description: "CSO took a report of damage. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4afaf68c7758097e4441c33ca0980818",
    date: "2026-05-14",
    time: "7:55 PM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Medical request",
    description: "Officers checked on subject. An incident report was completed.",
    isReported: true
  },
  {
    id: "e44bf91949fab1e853e535aef408e69f0",
    date: "2026-05-13",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e4399fb3d54903081fa0ca1bd8ecd85fa",
    date: "2026-05-12",
    time: "2:02 PM",
    location: "Valhalla House (1923 S Prairie Ave)",
    type: "Fire alarm",
    description: "CSO and SFFR responded to alarm. An incident report was completed.",
    isReported: true
  },
  {
    id: "ee8373db207c97088c659725437e868c0",
    date: "2026-05-11",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ebc8f5e540075b6bc3d197a8870eeb127",
    date: "2026-05-10",
    time: "12:48 AM",
    location: "Summit Apt Alley",
    type: "Suspicious vehicle",
    description: "CSO observed suspicious vehicle around campus. An incident report was completed.",
    isReported: true
  },
  {
    id: "e229af80a5ea15d0be7301b3dca8ef01a",
    date: "2026-05-10",
    time: "3:04 AM",
    location: "Stavig Hall (2008 S Walts Ave)",
    type: "Disorderly conduct",
    description: "CSO investigated subject in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "ed262c2cd5657e27b0c40397286e19619",
    date: "2026-05-10",
    time: "4:42 AM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Disorderly conduct",
    description: "CSO dealt with inebriated subject outside of dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "ef999bc88af8b022419f7cf47d7ffcc83",
    date: "2026-05-10",
    time: "8:18 PM",
    location: "Edith Mortenson Center (2112 S Grange Ave)",
    type: "Property damage",
    description: "CSO investigated report of damaged property. An incident report was completed.",
    isReported: true
  },
  {
    id: "e1a65bcafe3332043e7c4c22a80eb67d6",
    date: "2026-05-09",
    time: "3:11 AM",
    location: "OSL lot (909 W 33rd St)",
    type: "Disorderly conduct",
    description: "CSO investigated subject sleeping in lot. An incident report was completed.",
    isReported: true
  },
  {
    id: "e212d34cc1437a89a96999617698bc2d7",
    date: "2026-05-09",
    time: "5:06 AM",
    location: "Campus Pond",
    type: "Disorderly conduct",
    description: "CSO investigated subjects in pond. An incident report was completed.",
    isReported: true
  },
  {
    id: "e6901da54bc589d4734e4c02cf6d353ae",
    date: "2026-05-08",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ef0aad5480f37ad7cb83ec56572995562",
    date: "2026-05-07",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e08d6995cc5361ea53691c2ed4867565e",
    date: "2026-05-06",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e680bfa5dbaa697817ae617bd2dc797b1",
    date: "2026-05-05",
    time: "2:30 AM",
    location: "Wagoner Hall (2300 S Grange Ave)",
    type: "Theft",
    description: "CSO investigated theft in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e2d47ea9376b191da5f9547143747f80f",
    date: "2026-05-05",
    time: "8:00 AM",
    location: "Solberg Hall lot (2312 S Grange Ave)",
    type: "Auto collision",
    description: "CSO investigated auto accident in lot. An incident report was completed.",
    isReported: true
  },
  {
    id: "e7c2ac6843020113a96d6212f9e3a1cd9",
    date: "2026-05-05",
    time: "4:21 PM",
    location: "Tuve Hall lot (2016 S Menlo Ave)",
    type: "Unlawful entry of a vehicle",
    description: "CSO investigated entry into a vehicle. An incident report was completed.",
    isReported: true
  },
  {
    id: "ecff763b286286f295fd5667447841349",
    date: "2026-05-04",
    time: "9:12 PM",
    location: "Fryxell Humanities Center (2120 S Grange Ave)",
    type: "Medical response",
    description: "CSO assisted with medical request. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4875347b5330971b872df7a931148efa",
    date: "2026-05-03",
    time: "4:31 AM",
    location: "Balcer Apt (2420 S Summit Ave)",
    type: "Littering",
    description: "CSO investigated littering. An incident report was completed.",
    isReported: true
  },
  {
    id: "eae79ccbb398efc7b3de47a258ff787b7",
    date: "2026-05-02",
    time: "1:45 AM",
    location: "Stavig Hall (2008 S Walts Ave)",
    type: "Person of interest",
    description: "CSO and Student affairs checked on subject. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4f4a6e5f8ac11206a7b583d65f71d421",
    date: "2026-05-01",
    time: "1:29 PM",
    location: "Wagoner Hall (2300 S Grange Ave)",
    type: "Foreign aid",
    description: "CSO assisted SFPD with investigation. An incident report was completed.",
    isReported: true
  },
  {
    id: "e03f81b9b83f9275f02c564aee4e84af0",
    date: "2026-04-30",
    time: "1:15 PM",
    location: "Midco lot",
    type: "Vehicle collision",
    description: "CSO took a report of an accident. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec77d739e0cf31c8f2438cb64f398dbb0",
    date: "2026-04-29",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ed70df4b06af0e9e1bc2b3c56acd7604d",
    date: "2026-04-28",
    time: "8:23 AM",
    location: "Froiland Science Center (2407 S Summit Ave)",
    type: "Medical response",
    description: "CSO and SFFR responded to medical request. An incident report was completed.",
    isReported: true
  },
  {
    id: "e0c57d7cae3348f0029653485b70c923e",
    date: "2026-04-28",
    time: "5:41 PM",
    location: "Schoeneman Apt (1419 W 33rd St)",
    type: "Vehicle damage",
    description: "CSO took a report of damage. An incident report was completed.",
    isReported: true
  },
  {
    id: "ef7b587307fc0ced0d66c583fa0878dde",
    date: "2026-04-27",
    time: "2:30 AM",
    location: "Wagoner Hall (2300 S Grange Ave)",
    type: "Vehicle tow",
    description: "CSO towed car. An incident report was completed.",
    isReported: true
  },
  {
    id: "e1200a85ce90c8d681b9f122543ebd0e9",
    date: "2026-04-27",
    time: "12:00 PM",
    location: "Froiland Science Center (2407 S Summit Ave)",
    type: "Disorderly conduct",
    description: "CSO investigated conduct in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e2a4e61707a8a99dfe5220a253ef2b51f",
    date: "2026-04-26",
    time: "1:50 AM",
    location: "Our Saviors Lutheran Church (909 W 33rd St)",
    type: "Shots fired",
    description: "CSO heard shots fired from off campus in the Eastern neighborhood. SFPD was contacted.",
    isReported: true
  },
  {
    id: "ea986bc7654e05cbab7e964e36b2fd46a",
    date: "2026-04-25",
    time: "11:42 PM",
    location: "Bergsaker Hall (1110 W 33rd st)",
    type: "Medical emergency",
    description: "CSO responded after observing subject in need. Ambulance services were contacted. An incident report was completed.",
    isReported: true
  },
  {
    id: "e12365a78097eb90624bfe238200047f5",
    date: "2026-04-24",
    time: "3:30 PM",
    location: "Froiland Science Center (2407 S Summit Ave)",
    type: "Well Being check",
    description: "CSO and Student affairs did a well being check on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "e29d2a68bd27f93e227e6454c52319ff9",
    date: "2026-04-24",
    time: "9:43 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Alcohol Violation",
    description: "CSO stopped students in dorm and removed alcohol. An incident report was completed.",
    isReported: true
  },
  {
    id: "e135c6746453eadf8ea9e62286f37f0f1",
    date: "2026-04-24",
    time: "10:12 PM",
    location: "East Hall (2001 S Summit Ave)",
    type: "Noise complaint",
    description: "CSO check on a complaint on noise. An incident report was completed.",
    isReported: true
  },
  {
    id: "e9a180a3ec70e2dc09f7c8e8d697b6ee4",
    date: "2026-04-24",
    time: "11:32 PM",
    location: "Bergsaker Hall (1110 W 33rd St)",
    type: "Student conduct",
    description: "CSO and VA investigated student activities at building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e02ca38166e34624344c842254b08728e",
    date: "2026-04-23",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "eca34592674e79649d4d38a75a2b48802",
    date: "2026-04-22",
    time: "11:15 AM",
    location: "Granskou Hall (2009 S Prairie Ave)",
    type: "Well Being check",
    description: "CSO and Student affairs did a well being check on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "ebc37de8ccbfafa311e31e3d7c8148495",
    date: "2026-04-22",
    time: "7:50 PM",
    location: "Campus Green",
    type: "Injury",
    description: "CSO responded to the request for medical aid. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4140d3e938ea4f5a1cab13d185eb9da7",
    date: "2026-04-22",
    time: "8:37 PM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Medical emergency",
    description: "CSO responded to the request for medical aid. An incident report was completed.",
    isReported: true
  },
  {
    id: "ef7b2565d57e2d6bd8b63cbbb352fa10e",
    date: "2026-04-22",
    time: "8:43 PM",
    location: "Elmen Center (2505 S Grange Ave)",
    type: "Hit and Run",
    description: "CSO investigated a report of a hit in run in parking lot. An incident report was completed.",
    isReported: true
  },
  {
    id: "e630972e5e74bc8c7608ec97bd9092b7d",
    date: "2026-04-21",
    time: "9:26 AM",
    location: "University Welcome Center (2100 S Summit Ave)",
    type: "Disorderly conduct",
    description: "CSO took a report of a subject making disorderly conduct statements. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec1b6a44e2afd9acff4023168f466b82d",
    date: "2026-04-21",
    time: "10:30 AM",
    location: "Madsen Center (2301 S Summit Ave)",
    type: "Disorderly conduct",
    description: "CSO, SFPD and Sheriff searched for subject. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec456c477622ee6f9513d1b8fef35fca0",
    date: "2026-04-21",
    time: "5:52 PM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Disorderly conduct",
    description: "CSO observed subjects driving scooters on sidewalk. An incident report was completed.",
    isReported: true
  },
  {
    id: "e423e046e1ba42db001b736e1e626ecf2",
    date: "2026-04-20",
    time: "12:00 PM",
    location: "Administration (2101 S Summit Ave)",
    type: "Damage to property",
    description: "CSO investigated damage to property. An incident report was completed.",
    isReported: true
  },
  {
    id: "e558d51470cc69f8d6f7dab4d075b1159",
    date: "2026-04-20",
    time: "11:07 PM",
    location: "Stavig/Granskou Loop",
    type: "Disorderly subject, Trespass",
    description: "CSO removed subject from campus. An incident report was completed.",
    isReported: true
  },
  {
    id: "e654921f463bf241138aa6110abbf9ced",
    date: "2026-04-19",
    time: "3:47 AM",
    location: "Stavig Hall parking lot",
    type: "Suspicious vehicle",
    description: "CSO investigated subjects in vehicle. An incident report was completed.",
    isReported: true
  },
  {
    id: "ee35658cd199c36fd5a23e86d199f5555",
    date: "2026-04-19",
    time: "9:24 AM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Fire alarm",
    description: "CSO and SFFR checked on alarm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e31aff593768456c02be3e9c8c0e23fde",
    date: "2026-04-18",
    time: "1:40 AM",
    location: "Stavig Hall (2008 S Walts)",
    type: "Noise complaint",
    description: "CSO investigated report of group being loud. An incident report was completed.",
    isReported: true
  },
  {
    id: "e9f3ab54321c87305acff9074df07aa69",
    date: "2026-04-18",
    time: "10:20 PM",
    location: "Bergsaker Hall (1110 W 33rd St)",
    type: "Narcotics violation",
    description: "CSO investigated the smell of marijuana. An incident report was completed.",
    isReported: true
  },
  {
    id: "eed75474d2142d8ed008addb17fa64eae",
    date: "2026-04-18",
    time: "10:20 PM",
    location: "Grange Ave near tennis courts",
    type: "Suspicious Subject",
    description: "CSO checked on subject near campus. Escorted subject from campus. An incident report was completed.",
    isReported: true
  },
  {
    id: "eabe08b78f3591cbfd437850c2cb3c1d5",
    date: "2026-04-17",
    time: "8:30 PM",
    location: "Solberg Hall parking lot (2312 S Grange Ave)",
    type: "Vehicle tow",
    description: "CSO towed car from fire lane. An incident report was completed.",
    isReported: true
  },
  {
    id: "e6a990797e2764b5d37482ddd4fe9762e",
    date: "2026-04-17",
    time: "9:05 PM",
    location: "Granskou Hall parking lot (2009 S Prairie Ave)",
    type: "Vehicle tow",
    description: "CSO towed car from fire lane. An incident report was completed.",
    isReported: true
  },
  {
    id: "e58fa1b7b8548a756c71a97ce34d5706d",
    date: "2026-04-16",
    time: "6:59 PM",
    location: "Froiland Science Center (2407 S Summit Ave)",
    type: "Theft",
    description: "CSO took a theft report. An incident report was completed.",
    isReported: true
  },
  {
    id: "eff63bc7f2adbdd6056acb4e87e8330c4",
    date: "2026-04-15",
    time: "8:30 AM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Theft/lost item",
    description: "CSO investigated theft. An incident report was completed.",
    isReported: true
  },
  {
    id: "e1495bf0faea0cc09b85cb4fc405c3130",
    date: "2026-04-15",
    time: "12:01 PM",
    location: "Nelson Apt (2320 S Summit Ave)",
    type: "Narcotics violation",
    description: "CSO investigated the smell of marijuana. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4294b9b5e65f2baa8303c9940b2a2171",
    date: "2026-04-15",
    time: "3:47 PM",
    location: "Campus-wide",
    type: "Search assist",
    description: "CSO and SFPD searched for subject suspected to be on campus.",
    isReported: true
  },
  {
    id: "ef06883498d5baa6cc7b90963f0a8063c",
    date: "2026-04-14",
    time: "10:48 AM",
    location: "Our Saviours Lutheran (909 W 33rd St)",
    type: "Trespass",
    description: "CSO removed subject from area. An incident report was completed.",
    isReported: true
  },
  {
    id: "eb4dd6eee1607bddbbd6b4f428a4a5bd0",
    date: "2026-04-14",
    time: "2:34 PM",
    location: "Fryxell Humanities Center (2120 S Grange Ave)",
    type: "Medical check",
    description: "CSO did a medical check on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec5f408d273cb035bc5532025307fb22d",
    date: "2026-04-13",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ed7b966865d58c27e9845dfb88b7da1c4",
    date: "2026-04-12",
    time: "3:30 PM",
    location: "Midco parking lot",
    type: "Vehicle collision",
    description: "CSO investigated report of a vehicle collision. An incident report was completed.",
    isReported: true
  },
  {
    id: "ef4687cca13e091f5d4ab971f99baa1bf",
    date: "2026-04-11",
    time: "9:20 AM",
    location: "Tuve Hall (2016 S Menlo Ave)",
    type: "Welfare check",
    description: "CSO and Student Affairs checked on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "e26a1d2927fca60703f0ea5d89001562b",
    date: "2026-04-11",
    time: "9:57 PM",
    location: "Granskou Hall (2009 S Prairie Ave)",
    type: "Fire alarm",
    description: "CSO responded to a fire alarm in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e1cfb28ca0b7deb389e81d864375b6cbd",
    date: "2026-04-10",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e023b5701afe06e9bb2ed5f38416a0d7f",
    date: "2026-04-09",
    time: "6:20 PM",
    location: "Nelson Service Center (2021 S Menlo Ave)",
    type: "Public urination",
    description: "CSO removed subject from area. An incident report was completed.",
    isReported: true
  },
  {
    id: "e7a66b05ed4d204d7412cfa2c2acb3b3f",
    date: "2026-04-08",
    time: "1:56 AM",
    location: "Stavig Hall (2008 S Walt Ave)",
    type: "Vehicle tow",
    description: "CSO towed car from fire lane. An incident report was completed.",
    isReported: true
  },
  {
    id: "eb47bd0907dd5d6f7e6a704534cce59f1",
    date: "2026-04-08",
    time: "8:44 PM",
    location: "Granskou Hall (2009 S Prairie Ave)",
    type: "Sexual assault",
    description: "CSO took an assault report. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec7218e9940a227dc9f1a42adafeb6814",
    date: "2026-04-07",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e7bff2160960475aa31d00ced91eed39c",
    date: "2026-04-06",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e11c04fdb4712d0f0030663df3eb50a6f",
    date: "2026-04-05",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e7523d2a3d3f0384004fd17eefa8f5e0f",
    date: "2026-04-04",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e0a15800dc5ca3c598daee08fe2995bf6",
    date: "2026-04-03",
    time: "9:24 AM",
    location: "Wagoner Hall (2300 S Grange Ave)",
    type: "Public Assist",
    description: "CSO assisted with pet trapped in area. An incident report was completed.",
    isReported: true
  },
  {
    id: "e6650348de452e4757ab2ebb4e2c5864d",
    date: "2026-04-02",
    time: "12:00 PM",
    location: "Granskou Hall (2009 S Prairie Ave)",
    type: "Well Being Check",
    description: "CSO and Student Affairs checked on a student in need. An incident report was completed.",
    isReported: true
  },
  {
    id: "e021e7f8f5e571ed4976f04f7c8e2e84b",
    date: "2026-04-02",
    time: "2:30 PM",
    location: "Elmen Center (2505 S Grange Ave)",
    type: "Suspicious Person",
    description: "CSO checked on subject in parking lot. An incident report was completed.",
    isReported: true
  },
  {
    id: "e858dc340c7c6a4831cba051a6f75f86a",
    date: "2026-04-01",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ea78d1f940ac403cd9a3108c7890a9e04",
    date: "2026-03-31",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e7cf9ee03f3f2d0f4bc5b7091f70d3596",
    date: "2026-03-30",
    time: "1:59 AM",
    location: "Balcer Apt (2420 S Summit Ave)",
    type: "Disorderly Conduct",
    description: "CSO checked on noise disturbance and trespass. An incident report was completed.",
    isReported: true
  },
  {
    id: "e5197df41818d7ca1f50cb89d86210ae5",
    date: "2026-03-30",
    time: "2:40 AM",
    location: "East Hall (2001 S Summit Ave)",
    type: "Medical emergency",
    description: "CSO assisted with medical check on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "e7724872af85fb9b71c01d6c1fa285fed",
    date: "2026-03-30",
    time: "3:26 PM",
    location: "Center for Western Studies (2121 Summit Ave)",
    type: "Disorderly conduct",
    description: "CSO removed subject from building. An incident report was completed.",
    isReported: true
  },
  {
    id: "ebbf77cde697e5dbfa5ed978825de6a1a",
    date: "2026-03-30",
    time: "3:35 PM",
    location: "Mikkelsen Library (2117 S Summit Ave)",
    type: "Trespass, Parole absconder",
    description: "CSO and SFPD apprehended parole absconder. An incident report was completed.",
    isReported: true
  },
  {
    id: "e63ba9002cc6256cc0981b6b18cd3bc2a",
    date: "2026-03-29",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e48304ca92f968d45d222b43d4700a75e",
    date: "2026-03-28",
    time: "11:45 AM",
    location: "Tuve Hall (2016 S Menlo Ave)",
    type: "Medical emergency, Disorderly conduct",
    description: "CSO, SFPD and ambulance services assisted student with getting aid. An incident report was completed.",
    isReported: true
  },
  {
    id: "eaee70fbf1c323e5feee382ee1c5bf096",
    date: "2026-03-27",
    time: "9:55 AM",
    location: "Fryxell Humanities (2120 S Grange Ave)",
    type: "Assist other agency",
    description: "CSO assisted Parole Services with retrieving an item. An incident report was completed.",
    isReported: true
  },
  {
    id: "e1e419c00662fc3a021e90cda75ea16f6",
    date: "2026-03-27",
    time: "11:43 AM",
    location: "Fryxell Humanities (2120 S Grange Ave)",
    type: "Disorderly Conduct",
    description: "CSO looked for a person of interest. An incident report was completed.",
    isReported: true
  },
  {
    id: "e1824818a392dc2ee0ecc778a8e97808a",
    date: "2026-03-26",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e906d811763016100c215faa050817783",
    date: "2026-03-25",
    time: "11:15 AM",
    location: "Froiland Science Center (2407 S Summit Ave)",
    type: "Medical response",
    description: "CSO responded to request for medical aid. An incident report was completed.",
    isReported: true
  },
  {
    id: "e5d4c821c593a8374cc1546962498b881",
    date: "2026-03-24",
    time: "1:55 PM",
    location: "Chapel of Reconciliation (2125 S Summit Ave)",
    type: "Bat removal",
    description: "CSO removed bat from building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e58f01b8e2a1d44076fad9398d5984c81",
    date: "2026-03-24",
    time: "6:15 PM",
    location: "Froiland Science Center (2407 S Summit Ave)",
    type: "Fire safety check",
    description: "CSO and SFFR checked on report of gas smell. An incident report was completed.",
    isReported: true
  },
  {
    id: "ecd4a1b505224474a6980f8625ade9862",
    date: "2026-03-23",
    time: "8:10 PM",
    location: "Fryxell Humanities Center (2120 S Grange Ave)",
    type: "Theft",
    description: "CSO investigated theft. An incident report was completed.",
    isReported: true
  },
  {
    id: "e39245b836a656afcdfc03a905faf3b60",
    date: "2026-03-22",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "eeb7117514ae068c26d2738d12ca34a3f",
    date: "2026-03-21",
    time: "3:09 AM",
    location: "Bergsaker Hall (1110 W 33rd St)",
    type: "Intoxicated subject",
    description: "CSO investigated report of intoxicated subject. An incident report was completed.",
    isReported: true
  },
  {
    id: "e83466300fcac69ab29cc747b423bdffa",
    date: "2026-03-20",
    time: "6:58 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Gas spill",
    description: "CSO investigated gas found near vehicle. An incident report was completed.",
    isReported: true
  },
  {
    id: "e89738b0a227653c9b58c446c0f636aad",
    date: "2026-03-19",
    time: "1:25 PM",
    location: "Mikkelsen Library (2117 S Summit Ave)",
    type: "Disorderly conduct",
    description: "CSO removed subject from building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e62d7664c976671110bad24bc97ba1b4f",
    date: "2026-03-18",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e1162d9d91466d6c4d9c3eb92209c96d0",
    date: "2026-03-17",
    time: "3:30 AM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Medical response",
    description: "CSO and Student Affairs assisted student with medical need. An incident report was completed.",
    isReported: true
  },
  {
    id: "efc74e8555304566c6d2baf6f7d18ae6f",
    date: "2026-03-16",
    time: "10:29 AM",
    location: "Valhalla House (1923 S Prairie Ave)",
    type: "Fire alarm",
    description: "CSO and SFFR responded to alarm in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "ee62fd229c5d488471cf81456796e767f",
    date: "2026-03-15",
    time: "10:52 PM",
    location: "Stavig Hall (2008 S Walts Ave)",
    type: "Medical response",
    description: "CSO and Student Affairs called for ambulance to check on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "efa6e48c003661b5958dc917eae50a252",
    date: "2026-03-14",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e8bec5d6d575f78e0d6efa4241876e9ea",
    date: "2026-03-13",
    time: "2:09 PM",
    location: "Stavig Hall (2008 S Walts Ave)",
    type: "Disorderly conduct",
    description: "CSO removed subject from campus. An incident report was completed.",
    isReported: true
  },
  {
    id: "e272e9fad9ab4f934361ae9eb656a13f2",
    date: "2026-03-12",
    time: "12:32 PM",
    location: "Nelson Service Center (2021 Menlo Ave)",
    type: "Loose dog",
    description: "CSO recovered lost dog. An incident report was completed.",
    isReported: true
  },
  {
    id: "e40a5cd4de99c212e8882d63849084481",
    date: "2026-03-11",
    time: "2:28 AM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Theft",
    description: "CSO investigated theft in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e23d59a7a2cee763fe40088cb97e02935",
    date: "2026-03-10",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e0c93019aaf115d0e7d9b26e905b0c3b2",
    date: "2026-03-09",
    time: "10:50 AM",
    location: "Fryxell Humanities (2120 S Grange Ave)",
    type: "Assisting public",
    description: "CSO checked on visiting group and lended aid. An incident report was completed.",
    isReported: true
  },
  {
    id: "e6896975223fad2edef3230befb86fb54",
    date: "2026-03-08",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e3d9af6e86fd6cdd7a2e264e203080609",
    date: "2026-03-07",
    time: "2:23 AM",
    location: "Kirkeby Over Stadium (2700 S Lake Ave)",
    type: "Slip and fall",
    description: "CSO took a slip and fall report. An incident report was completed.",
    isReported: true
  },
  {
    id: "eb677e08327dda798fc93ec2bd44891c2",
    date: "2026-03-06",
    time: "10:58 AM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Disorderly conduct",
    description: "CSO investigated subject trying to gain entry to dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e43a3acaa5b13fcb38a80af9b8c0201a9",
    date: "2026-03-06",
    time: "1:45 PM",
    location: "Granskou Hall (2009 S Prairie Ave)",
    type: "Damage to property",
    description: "CSO investigated damage in parking lot. An incident report was completed.",
    isReported: true
  },
  {
    id: "e5ad2651275863bb7fabe99a0cf624449",
    date: "2026-03-05",
    time: "11:00 AM",
    location: "Solberg Hall Parking lot (2312 S Grange Ave)",
    type: "Auto accident",
    description: "CSO investigated damage done to vehicles. An incident report was completed.",
    isReported: true
  },
  {
    id: "e8cda65adba0ca0de1a81d6c62eb676ad",
    date: "2026-03-04",
    time: "8:45 AM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Wellbeing check",
    description: "CSO and Student Affairs checked on a student in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "edd3280fbecce61e7c1993e63ce029965",
    date: "2026-03-03",
    time: "2:54 PM",
    location: "Our Saviors Lutheran Church (909 W 33rd st)",
    type: "Disorderly Conduct",
    description: "CSO were contacted to check on subject. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec29158799bcd597e98a63e1b851b9458",
    date: "2026-03-02",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e50c06d81eacc99379ec8da6bd069724f",
    date: "2026-03-01",
    time: "12:01 AM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Medical response for intoxicated subject",
    description: "CSO responded to request to check on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "e55fd23bcae234ffd44cd86c630a034d0",
    date: "2026-02-28",
    time: "4:45 PM",
    location: "Bergsaker Hall (1110 W 33rd St)",
    type: "Suspicious individual",
    description: "CSO investigated report of suspicious subject in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "ebb60646ff5394ce739da13e8ce972e55",
    date: "2026-02-27",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e0141498eaca9c11db5b0c9be078e63cd",
    date: "2026-02-26",
    time: "1:00 PM",
    location: "Solberg Hall Parking Lot",
    type: "Vehicle collision",
    description: "CSO and SFPD investigated collision. An incident report was completed.",
    isReported: true
  },
  {
    id: "e873913fc740c00cd97c67a9a3dc70768",
    date: "2026-02-26",
    time: "1:10 PM",
    location: "Fryxell Humanities Center (2120 S Grange Ave)",
    type: "Medical response",
    description: "CSO responded to medical request. An incident report was completed.",
    isReported: true
  },
  {
    id: "e392489e54d1a2291f468425a8379c1e5",
    date: "2026-02-26",
    time: "8:28 PM",
    location: "Froiland Science Center (2407 S Grange Ave)",
    type: "Suspicious subject",
    description: "CSO removed subject from campus. An incident report was completed.",
    isReported: true
  },
  {
    id: "e78e5f215052a64831de7b4af9f9fff52",
    date: "2026-02-26",
    time: "10:40 PM",
    location: "Our Saviors Lutheran Church (909 W 33rd St)",
    type: "Vandalism",
    description: "CSO investigated vandalism found in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e13c6c2a4ba01ca671f1059f96b02b794",
    date: "2026-02-25",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e0f33d6844cfd2c27a1cd6fa18f6fe34d",
    date: "2026-02-24",
    time: "11:38 AM",
    location: "33rd and Grange Ave",
    type: "Assist with arrest warrant",
    description: "CSO assisted SF Warrant Task Force. An incident report was completed.",
    isReported: true
  },
  {
    id: "e2456f332f3e22ff75b03377cb9c1d20c",
    date: "2026-02-24",
    time: "4:45 PM",
    location: "Elmen Center (2505 S Grange Ave)",
    type: "Medical response",
    description: "CSO responded to medical request. An incident report was completed.",
    isReported: true
  },
  {
    id: "eb1d8c855946f9cbbe9abeb2cfda6e42e",
    date: "2026-02-23",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e97c625324df5f1903c420db8947fe7b9",
    date: "2026-02-22",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e4fc3ca24ba52e64bd4ace421ff8afc2f",
    date: "2026-02-21",
    time: "12:31 AM",
    location: "Balcer Apt (2400 S Summit Ave)",
    type: "Noise disturbance",
    description: "CSO investigated report of noise complaint. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4af95a6e1949a88ccc0cc4add9d78130",
    date: "2026-02-20",
    time: "8:45 AM",
    location: "Valhalla House (1923 S Prairie Ave)",
    type: "Fire Alarm",
    description: "CSO and SFFR responded to fire alarm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e348c1598bb0f4773b5be5b0f66275836",
    date: "2026-02-20",
    time: "12:06 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Vandalism",
    description: "CSO investigated damage in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "e0974e15ccd512e89dd64e7ea235a4b51",
    date: "2026-02-19",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e723fb446cfda712c67ddccbb28e7633d",
    date: "2026-02-18",
    time: "5:05 PM",
    location: "Valhalla House (1923 S Prairie Ave)",
    type: "Fire Alarm",
    description: "CSO and SFFR responded to fire alarm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e22ab74960552573147a980fc4ac6cdb0",
    date: "2026-02-17",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ea43d7b5de3d1f5a36170b31ba8b85396",
    date: "2026-02-16",
    time: "11:14 AM",
    location: "Costello Hall (2413 S Grange Ave)",
    type: "Fire alarm",
    description: "CSO and SFFR responded to fire alarm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e1a866e8e1e37362fffc8c4b608c7b05b",
    date: "2026-02-16",
    time: "7:40 PM",
    location: "Morrison Commons (2112 S Grange Ave)",
    type: "Medical response",
    description: "CSO responded to a request for medical aid. An incident report was completed.",
    isReported: true
  },
  {
    id: "e6aa2fc126821e3b0e8176e039cbc3110",
    date: "2026-02-15",
    time: "3:27 AM",
    location: "Tuve Hall (2016 S Menlo Ave)",
    type: "Noise complaint",
    description: "CSO and Student Affairs investigated report of noise disturbance in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "ec97ede432f537abe31061d64397c99a1",
    date: "2026-02-15",
    time: "8:15 PM",
    location: "Elmen Center (2505 S Grange Ave)",
    type: "Trespass",
    description: "CSO investigated subjects in building. An incident report was completed.",
    isReported: true
  },
  {
    id: "ea0fd88f3fc0970705cebdf462ff66e0d",
    date: "2026-02-15",
    time: "10:21 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Noise complaint",
    description: "CSO and Student Affairs investigated report of noise disturbance in dorm. An incident report was completed.",
    isReported: true
  },
  {
    id: "e51d35b7eaac8faf5770ce48e87c4a173",
    date: "2026-02-14",
    time: "10:15 AM",
    location: "2000 S Prairie block north of campus",
    type: "Theft from vehicle",
    description: "CSO investigated a report of theft from car. An incident report was completed.",
    isReported: true
  },
  {
    id: "eb12885fbf52176107b95b74205692591",
    date: "2026-02-14",
    time: "5:30 PM",
    location: "Midco Arena",
    type: "Medical response",
    description: "CSO and Medic checked on visitor. An incident report was completed.",
    isReported: true
  },
  {
    id: "ebf21361b22af17baf6778a0f5bdae568",
    date: "2026-02-13",
    time: "12:42 PM",
    location: "University Welcome Center (2100 S Summit Ave)",
    type: "Disorderly Conduct",
    description: "CSO investigated a report of a subject causing disorderly conduct. An incident report was completed.",
    isReported: true
  },
  {
    id: "e2d78464f156b7565b974c78cec9465e2",
    date: "2026-02-13",
    time: "8:30 PM",
    location: "Stavig Hall (2008 S Walts Ave)",
    type: "Vehicle tow",
    description: "CSO towed car from fire lane. An incident report was completed.",
    isReported: true
  },
  {
    id: "e53f7cf85d5ac5bf19dff7b7a0baad2dd",
    date: "2026-02-12",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e9ed685a981409aa52b0d5f6688f0a032",
    date: "2026-02-11",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e366d34aa4e272c13d3f12691cbaedc41",
    date: "2026-02-10",
    time: "12:54 PM",
    location: "Solberg Hall (2312 S Grange Ave)",
    type: "Fire alarm",
    description: "CSO investigated alarm. Source found and maintenance notified. An incident report was completed.",
    isReported: true
  },
  {
    id: "e038bbf4f0033f6dc338fc926ab238a9a",
    date: "2026-02-09",
    time: "9:28 AM",
    location: "Madsen Center (2301 S Summit Ave)",
    type: "Medical response",
    description: "CSO responded to medical request. An incident report was completed.",
    isReported: true
  },
  {
    id: "e08f319dcb17bbeb97217a086986976d7",
    date: "2026-02-08",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e73901d48f5399bb6a6dc73786e14d6c2",
    date: "2026-02-07",
    time: "3:43 AM",
    location: "Solberg Lot (2312 S Grange Ave)",
    type: "Found alcohol",
    description: "CSO found alcohol in lot. An incident report was completed.",
    isReported: true
  },
  {
    id: "e2f2bfcca3de053bc32267239d11b9e89",
    date: "2026-02-07",
    time: "1:31 PM",
    location: "Costello (2413 S Grange Ave)",
    type: "Smell of smoke",
    description: "CSO investigated report of smoke. Washer was overloaded. An incident report was completed.",
    isReported: true
  },
  {
    id: "ebab4318dfeff263f1794f9d8a41cfcd9",
    date: "2026-02-07",
    time: "11:05 PM",
    location: "Bergsaker (1110 W 33rd St)",
    type: "Domestic Violence",
    description: "CSO and Student Affairs investigated report of domestic violence. An incident report was completed.",
    isReported: true
  },
  {
    id: "e5ef3406e6c172e3e616305527a4d2274",
    date: "2026-02-06",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "ef1799c6863192228bc394ba3857f87b6",
    date: "2026-02-05",
    time: "1:42 PM",
    location: "Costello Hall (2413 S Grange Ave)",
    type: "Smell of smoke",
    description: "CSO investigated report of smoke. Washer was overloaded. An incident report was completed.",
    isReported: true
  },
  {
    id: "eef1ef58cacbd44a73621a049bb1d72ee",
    date: "2026-02-04",
    time: "3:40 PM",
    location: "Wagoner Lot (2300 S Grange Ave)",
    type: "Missing vehicle",
    description: "CSO investigated a missing vehicle. Vehicle was found. An incident report was completed.",
    isReported: true
  },
  {
    id: "e873834d6e307b03d471e648cc11ab841",
    date: "2026-02-04",
    time: "10:24 PM",
    location: "Bergsaker Hall (1110 W 33rd St)",
    type: "Welfare check",
    description: "CSO and Student Affairs checked on student. An incident report was completed.",
    isReported: true
  },
  {
    id: "e723b192626d455c2c1e25cd4a6da4e31",
    date: "2026-02-03",
    time: "12:17 AM",
    location: "Granskou Hall, (2009 S Prairie Ave)",
    type: "Noise complaint",
    description: "CSO and Student Affairs responded to complaints on noise. An incident report was completed.",
    isReported: true
  },
  {
    id: "e4ae14721167c28d798a913bf7123080b",
    date: "2026-02-02",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  },
  {
    id: "e6d611d419bd6f044865c4745da549fd8",
    date: "2026-02-01",
    time: "",
    location: "Campus-wide",
    type: "Nothing to report",
    description: "Nothing to report.",
    isReported: false
  }
];

export function getCategory(type: string): IncidentCategory {
  const norm = type.toLowerCase();
  if (norm.includes("nothing to report")) return IncidentCategory.NOTHING;
  if (norm.includes("welfare") || norm.includes("well being") || norm.includes("wellbeing") || norm.includes("welfare check") || norm.includes("person of interest") || norm.includes("student conduct")) {
    return IncidentCategory.WELFARE;
  }
  if (norm.includes("narcotics") || norm.includes("alcohol") || norm.includes("substance") || norm.includes("marijuana") || norm.includes("controlled substance")) {
    return IncidentCategory.SUBSTANCE;
  }
  if (norm.includes("fire") || norm.includes("smoke") || norm.includes("gas") || norm.includes("safety") || norm.includes("alarm")) {
    return IncidentCategory.FIRE;
  }
  if (norm.includes("theft") || norm.includes("damage") || norm.includes("vandalism") || norm.includes("littering") || norm.includes("lost item") || norm.includes("scam") || norm.includes("property damage")) {
    return IncidentCategory.THEFT;
  }
  if (norm.includes("medical") || norm.includes("injury") || norm.includes("fall") || norm.includes("emergency") || norm.includes("ambulance")) {
    return IncidentCategory.MEDICAL;
  }
  if (norm.includes("suspicious") || norm.includes("trespass") || norm.includes("disorderly") || norm.includes("conduct") || norm.includes("noise") || norm.includes("shots fired") || norm.includes("public urination")) {
    return IncidentCategory.DISORDERLY;
  }
  if (norm.includes("tow") || norm.includes("vehicle") || norm.includes("collision") || norm.includes("accident") || norm.includes("car")) {
    return IncidentCategory.TRAFFIC;
  }
  return IncidentCategory.OTHER;
}

// Attach categories to raw records
export const PROCESSED_FALLBACK_INCIDENTS: Incident[] = (FALLBACK_INCIDENTS as any[]).map(inc => {
  // Extract clean address and building
  let locationName = "Campus-wide";
  let address = "";
  const rawLocation = inc.location || "Campus-wide";
  
  if (rawLocation && rawLocation !== "Campus-wide") {
    const match = rawLocation.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      locationName = match[1].trim();
      address = match[2].trim();
    } else {
      locationName = rawLocation;
    }
  }

  const category = getCategory(inc.type || inc.description);

  return {
    id: inc.id,
    date: inc.date,
    rawDateStr: "", // will be computed with formatDateStr
    time: inc.time || "",
    type: inc.type || "",
    rawLocation: rawLocation,
    locationName,
    address,
    category,
    description: inc.description,
    isNothingToReport: !inc.isReported
  };
}).map(inc => ({
  ...inc,
  rawDateStr: formatDateStr(inc.date)
}));

function formatDateStr(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}
