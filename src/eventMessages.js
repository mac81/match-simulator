const eventMessages = {
  kickoff: "{{team}} kickoff",
  'short-throw': {
    goalkeeper: {
      attempt: "{{attackingTeam}}'s goalkeeper throws it short to {{to}}",
      successful: "{{attackingTeam}}'s goalkeeper makes a successful throw to {{to}}",
      intercept: "{{defendingTeam}} intercepts the throw",
      fail: "{{attackingTeam}}'s goalkeeper makes a dreadful throw and the ball goes to a throw in"
    }
  },
  'goal-kick': {
    goalkeeper: {
      attempt: "{{attackingTeam}}'s goalkeeper hits it from the 5 yard mark to {{to}}",
      successful: "{{attackingTeam}}'s goalkeeper makes a successful goalkick to {{to}}",
      intercept: "{{defendingTeam}} intercepts the goalkick",
      fail: "{{attackingTeam}}'s goalkeeper makes a dreadful goalkick and the ball goes to a throw in"
    }
  },
  'short-pass': {
    goalkeeper: {
      attempt: "{{attackingTeam}}'s goalkeeper passes it short to {{to}}",
      successful: "{{attackingTeam}}'s goalkeeper makes a successful pass to {{to}}",
      intercept: "{{defendingTeam}} intercepts the pass",
      fail: "{{attackingTeam}}'s goalkeeper makes a dreadful pass and the ball goes to a throw in"
    },
    defence: {
      attempt: '{{attackingTeam}} tries a pass from {{from}} to {{to}}',
      successful: '{{attackingTeam}} makes a successful pass to {{to}}',
      intercept: '{{defendingTeam}} intercepts the pass',
      fail: '{{attackingTeam}} makes a dreadful pass and the ball goes to a throw in'
    },
    midfield: {
      attempt: '{{attackingTeam}} tries a pass from {{from}} to {{to}}',
      successful: '{{attackingTeam}} makes a successful pass to {{to}}',
      intercept: '{{defendingTeam}} intercepts the pass',
      fail: '{{attackingTeam}} makes a dreadful pass and the ball goes to a throw in'
    },
    offence: {
      attempt: '{{attackingTeam}} tries a pass from {{from}} to {{to}}',
      successful: '{{attackingTeam}} makes a successful pass to {{to}}',
      intercept: '{{defendingTeam}} intercepts the pass',
      fail: '{{attackingTeam}} makes a dreadful pass and the ball goes to a throw in'
    }
  },
  'shot-on-target': {
    offence: {
      attempt: '{{attackingTeam}} hammers it towards goal',
      goal: '{{attackingTeam}} scores!!!',
      save: '{{defendingTeam}} makes a great save',
    }
  },
  'shot-off-target': {
    offence: {
      attempt: '{{attackingTeam}} shoots',
      goalkick: '{{attackingTeam}} misses by a mile. Goalkick to {{defendingTeam}}'
    }
  },
  tackle: {
    offence: {
      attempt: '{{defendingTeam}} tackles',
      successful: '{{defendingTeam}} makes a important tackle.',
    }
  }
}

export default eventMessages;
