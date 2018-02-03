const _ = require('lodash');
const db = require('./db');
const xlsx = require('node-xlsx');

const jokes = _.map(_.map(xlsx.parse(process.argv[2])[0].data, _.first), joke =>
  _.replace(joke, /'/g, '’')
);

const createCategory = async () => {
  let category;
  console.log(process.argv[3]);
  try {
    category = await db.one('select * from categories where name=${name}', {
      name: process.argv[3],
    });
  } catch (e) {
    category = await db.one('insert into categories (name) values (${name}) returning *', {
      name: process.argv[3],
    });
  }
  return category;
};

const run = async () => {
  const category = await createCategory();
  try {
    const insertedJokes = await db.any(
      `insert into jokes (joke) values ${_.join(_.map(jokes, joke => `('${joke}')`), ',')} returning *`
    );
    await db.any(
      `insert into category_has_joke (category_id,joke_id) values ${_.join(_.map(insertedJokes, joke => `(${category.id},${joke.id})`), ',')} returning *`
    );
  } catch (e) {
    console.log(e);
  }
};
run();
