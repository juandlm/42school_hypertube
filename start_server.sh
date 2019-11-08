#!/bin/sh 
osascript <<END 
tell application "Terminal"
    do script "cd $(pwd)/client && npm start"
	end tell
END

osascript <<END
tell application "Terminal"
    do script "cd $(pwd)/server && npm run prod"
end tell
END