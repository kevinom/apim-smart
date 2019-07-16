module.exports = function(Store) {
  Store.disableRemoteMethod('createChangeStream', true);
  Store.disableRemoteMethod('updateAll', true);
  Store.disableRemoteMethod('findOne', true);

  Store.disableRemoteMethod('__delete__inventory', false);
};
