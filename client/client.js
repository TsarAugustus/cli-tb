#!/usr/bin/env node

const vorpal = require('vorpal')();
const inquirer = require('inquirer');
const axios = require('axios');

const users = [
  { username: 'John', message: 'wtf lol'},
  { username: 'Dutch', message: 'assdgsdgdfh lol'},
  { username: 'Arthur', message: 'dgdgdcxcvsdvdg lol'},
  { username: 'Blah', message: 'wtf lol'},
  { username: 'Tip', message: 'wtf lol'},
];

function load() {

  const searchList = [
    {
      type: 'list',
      name: 'search',
      message: 'What would you like to search?',
      choices: ['Boards', 'Users'],
      filter: function(val) {
        return val.toLowerCase();
      }
    },
    {
      type: 'input',
      name: 'param',
      message: 'What are you searching for?',
      filter: function(val) {
        return val.toLowerCase();
      }
    }

  ];

  vorpal
  .command('search', 'Search items')
  .description('Searches users or boards')
  .action(function(args, callback) {
    inquirer
    .prompt(searchList)
    .then(results => {
      //console.log(results)
      if(results.search === 'users') {

        axios.get('http://localhost:3000/api/users/' + results.param)
        .then(function(res) {
          console.log(`List of users with ${results.param} in the username`)
          for (i = 0; i < res.data.length; i++) {
            console.log(res.data[i].username)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
        .then(function() {
          callback();
        });
      }
    })
  });

  vorpal
    .delimiter('cli-tb$')
    .show();
}

load();
