const CHANNELS = {
  "personal utility": "1571060109356830751",
  "bot testing": "1571121130436300830",
  "lame people club": "1148834009711911002"
};

const S = 1000;
const M = S * 60;
const H = M * 60;

export default {
  channelId: CHANNELS["lame people club"],
  timeFrame: {
    min: H * 3,
    max: H * 18
  },
  admins: [
    "820234173574938635", // rinderpest
    "1346147093584019467", // chiptumor
  ],
  multiple: {
    chance: 1 / 30,
    max: 10
  }
};
