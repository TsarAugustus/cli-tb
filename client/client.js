#!/usr/bin/env node

const vorpal = require('vorpal')();
const inquirer = require('inquirer');
const axios = require('axios');
const chalk = require('chalk');
const log = console.log;

const usernameInput = [
  {
    type: 'input',
    name: 'username',
    message: 'What is your username?',
    filter: function(val) {
      return val.toLowerCase();
    }
  }
];

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
}];

function load() {
  //vorpal.ui.delimiter('cli-tb$');


  let currentDelimiter = 'cli-tb$';

  let username = '';
  if(!username) {
    log(chalk.cyan('Username can be set with -u'));
  }

  let posts = [];
  let boards = [];
  let currentBoard = '';
  const postList = [
    {
      type: 'list',
      name: 'posts',
      message: 'What post would you like to see?',
      choices: posts,
      filter: function(val) {
        // console.log('VALUE IS: ' + val)
        return val.toLowerCase();
      }
    }
  ];
  const boardList = [
    {
      type: 'list',
      name: 'boards',
      message: 'What board would you like to use?',
      choices: boards,
      filter: function(val) {
        return val.toLowerCase();
      }
    }
  ];

  //Set local username?
  vorpal
  .command('username', 'Set Username')
  .alias('-u')
  .description('Set your username')
  .action(function(args, callback) {
    inquirer
    .prompt(usernameInput)
    .then(result => {
      console.log(`Welcome ${result.username}`);
      username = result.username;
      callback();
    });
  })

  // Search command. Can search for individual users or boards
  vorpal
  .command('search', 'Search items')
  .alias('-s')
  .description('Searches users or boards')
  .action(function(args, callback) {
    inquirer
    .prompt(searchList)
    .then(results => {
      //console.log(results)
      if(results.search === 'users') {

        // Get all users with the search parameters.
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
      } else if (results.search ==='boards') {
        axios.get('http://localhost:3000/api/boardList/' + results.param)
        .then(function(res) {
          console.log(`List of boards with ${results.param} in the boardId`);
          for(i = 0; i < res.data.length; i++) {
            console.log(`${res.data[i].boardId} - ${res.data[i].description}`)
          }
          //console.log(res)
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          callback();
        })
      }
    })
  });

  vorpal
  .command('show [board] [thread]', 'Show board posts')
  .description('Shows all the posts on a board')
  .action(function(args, callback) {
    if(!currentBoard) {
      console.log('Please use a board');
      callback();
    } else {
      axios.get('http://localhost:3000/api/boardPosts/' + args.board)
      .then(function(response) {
        for(i = 0; i < response.data.length; i++) {
          posts.push(`${response.data[i].threadNum} - ${response.data[i].content}`)
        }
        inquirer
        .prompt(postList)
        .then(result => {
          console.log(result)
          callback();
        });
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(function() {
      });
      console.log(args)
      console.log(username);
      console.log(currentBoard);
    }
  });

  vorpal
  .command('use', 'Use a board')
  .description('Use a specified board')
  .action(function(args, callback) {
    axios.get('http://localhost:3000/api/boards')
    .then(function(response) {
      for(i = 0; i < response.data.length; i++) {
        boards.push(`${response.data[i].boardId} - ${response.data[i].description}`);
      }
    })
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      inquirer
      .prompt(boardList)
      .then(result => {
        log(chalk.cyan('Now using the') + chalk.green(` ${result.boards.charAt(0).toUpperCase()} `) + chalk.cyan('board'));
        currentBoard = result.boards.charAt(0);
        //currentDelimiter = currentBoard;
        //vorpal.ui.delimiter(currentBoard)
        callback();
      })
    });
  });

  // setInterval(function() {
  //   vorpal.ui.delimiter(`${currentDelimiter}$`);
  // }, 1000);

  vorpal
  .delimiter(currentDelimiter)
  .show();
}

load();
