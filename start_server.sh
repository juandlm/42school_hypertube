#!/bin/sh 
osascript <<END 
tell application "Terminal"
    do script "cd ~/Desktop/Hypertube/client && npm start"
	end tell
END

osascript <<END
tell application "Terminal"
    do script "cd ~/Desktop/Hypertube/server && npm run prod"
end tell
END