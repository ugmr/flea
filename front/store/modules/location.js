import * as api from "../../api";

export default {
  namespaced: true,
  state: {
    province: "",
    city: "",
    latitude: 0,
    longitude: 0,
  },
  mutations: {
    ["SET_LOCATION"](state, location) {
      state.province = location.province;
      state.city = location.city;
      state.latitude = location.latitude;
      state.longitude = location.longitude;
    },
  },
  actions: {
    async ["GET_LOCATION"]() {
      const res = await uni.getLocation({ type: "wgs84" });
      const data = await api.geocode({
        location: `${res[1].longitude},${res[1].latitude}`,
      });

      let { province, city } = data.regeocode.addressComponent;

      if (!city.length) {
        city = province;
      }
      return {
        longitude: res[1].longitude,
        latitude: res[1].latitude,
        province,
        city,
      };
    },
  },
};
