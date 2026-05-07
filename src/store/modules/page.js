export default {
  namespaced: true,
  state: {
    keyWord: sessionStorage.getItem("keyWord") || "",
    eventId: sessionStorage.getItem("eventId") || "",
  },
  mutations: {
    setKeyword(state, keyWord) {
      state.keyWord = keyWord;
      sessionStorage.setItem("keyWord", keyWord);
    },
    setEventId(state, eventId) {
      state.eventId = eventId;
      sessionStorage.setItem("eventId", eventId);
    },
  },
};
