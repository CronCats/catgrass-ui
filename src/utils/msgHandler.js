class MsgHandler {
  set = (data, address) => {
    let set = { data };
    if (address) set.address = address;
    return { set };
  };

  send = (address, message) => {
    let send = { address };
    if (message) send.message = message;
    return { send };
  };

  remove = () => {
    return { remove: {} };
  };

  linkAdd = (shortname, url) => {
    return { link_add: { shortname, url } };
  };

  linkRemove = (shortname) => {
    return { link_remove: { shortname } };
  };

  bitAdd = (bit) => {
    return { bit_add: { bit } };
  };

  bitRemove = (bit) => {
    return { bit_remove: { bit } };
  };

  getMetadata = (address) => {
    return { get_metadata: { address } };
  };

  getBits = (address) => {
    return { get_bits: { address } };
  };

  getActivity = (address) => {
    return { get_activity: { address } };
  };

  getAlias = (alias) => {
    return { get_alias: { alias } };
  };

  getLink = (shortname) => {
    return { get_link: { shortname } };
  };

  getLinks = (address) => {
    return { get_links: { address } };
  };

  search = (query) => {
    return { search: { query } };
  };

  getConfig = () => {
    return { get_config: {} };
  };

  getStats = () => {
    return { get_stats: {} };
  };
}

export default new MsgHandler();
