# INFO30005_DIABETES_AT_HOME

Local Setup Instructions

> git clone https://github.com/acmahaja/INFO30005_DIABETES_AT_HOME.git

> npm i // install missing libraries

-----------------
#ONLY if need to repopulate database (database should be already populated)
#this WILL delete the entire database content and repopulate it

> node populateDB.js // populate mongodb atlas db
                   // let script execute for a 5-7 minutes to clear and 
                   // populate remote database
-----------------

> node index.js // run app

Deploy to Heroku 

// make sure heroku cli is installed

> heroku login

// press random key to login
> heroku: Press any key to open up the browser to login or q to exit: 

// Then login into the browser
Opening browser to https://cli-auth.heroku.com/auth/cli/browser/...
Logging in... done
Logged in as someone@email.com

// check if heroku remote repo is linked to the local git
> git remote -v
heroku  https://git.heroku.com/info-30005-diabetes-at-home.git (fetch)
heroku  https://git.heroku.com/info-30005-diabetes-at-home.git (push)
origin  https://github.com/acmahaja/INFO30005_DIABETES_AT_HOME.git (fetch)
origin  https://github.com/acmahaja/INFO30005_DIABETES_AT_HOME.git (push)

// if remote repo isnt present
> heroku git:remote -a info-30005-diabetes-at-home

// commit and deploy to heroku
> git add .

> git commit -m "make it better"

> git push heroku main
