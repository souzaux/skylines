import Ember from 'ember';

import safeComputed from '../computed/safe-computed';

export default Ember.Component.extend({
  account: Ember.inject.service(),

  editable: safeComputed('account.user.id', 'user.id', (accountId, userId) => accountId && accountId === userId),
});
