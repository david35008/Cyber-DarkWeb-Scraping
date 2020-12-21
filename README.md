
CYBER4S THREAT INTELLIGENCE 
CHALLENGE BY INTSIGHTS

OCTOBER 2020


![hide](.firefox_F94cLsz93u.png)



Challenge Description

In this challenge you’ll develop a scraping, analysis and presentation platform to one of the most hideous places on the dark-web: The Stronghold Paste Site. This site contains a lot of criminal activity, ranging from illegal hacking and data theft attempts, through hitmans and other criminal services for sell and all the way to links to child pornography sites. You can see excerpts from the website’s content below.  

Note - This site is a “paste site”, which means hackers and cybercriminals have the chance to post whatever textual content they wish to and it will be published there for 1 day. 

This site resides on the darknet, and is only accessible through the TOR network that provides the cyber criminals with anonymity. After setting up your TOR access, you’ll be able to access the site on: http://nzxj65x32vh2fkhk.onion/all.

How to access the tor network using docker (the command below opens an http proxy on port 8118 and a socks proxy on port 9050):
docker run -it -p 8118:8118 -p 9050:9050 -d dperson/torproxy



Challenge Phases

You'll need to gather each one of the new "pastes" from Stronghold, and parse it into the following structure:
Author - String
Title - String
Content - String
Date - Date
The code must be self managed. It should crawl the site every 2 minutes and look for any new pastes to save.
For the most basic form of this exercise it will suffice to keep each paste in the above format in a different text file in a directory of your choosing. See bonus phases below for alternatives if you have enough time.
Display the collected data along with any analysis of your choice in an organized dashboard. Keep the dashboard updated regularly to display the newly posted data.





Bonus Phases

Bonus #1
Each one of the paste model's parameters must be normalized.
For example:
    * Author - In cases it's Guest, Unknown, Anonymous, etc... the author name must be the same, for example: "" (empty string)
    * Title - Same as with Author.
    * Date - UTC Date
    * Content - Must be stripped of trailing spaces.

Bonus #2

Store each one of the pastes in an organized database. It could be done with anything from a local SQLite database to a mongo db docker container.

Bonus #3

Ship the entire solution inside a docker-compose environment.

Bonus #4

Add an omni-search bar to the platform. Use debounce to make the search more efficient
Use Material UI for dashboard components

Bonus #5

Incorporate data analysis methodologies on the content and display them in the dashboard too. A few examples:
Use Named Entity Recognition to extract entities from the text and display them as tags in the dashboard. You can use Node’s standard NER library for that (note that it requires installation of some dependencies. Read the docs).
Use Sentiment Analysis to identify the general sentiment of the content, along with positive and negative words, and display it in the dashboard. You can use Node’s standard Sentiment Analysis library.


Bonus #6
Create an alerting system based on keywords matching - 
Create 2 new views: Keywords and Alerts
In the keywords view, your user should be able to insert keywords that will be stored in the platform
Every few minutes (configurable), all the keywords should be searched in the data collected above. You should support full-matching and partial-matching search
Every found match should be considered an alert, and should be displayed in the alerts view, along with all the details of the source data, the keywords, and if it was a full match or a partial match
The keyword searching platform should be self managed and run on a configurable interval

Bonus #7
Create a notification system in the platform, where the following events will trigger a notification:
Data collection from a source completed successfully
Data collection from a source has failed
A new alert was found (see bonus #6)

Some inspiration:


Bonus #8
Create a scraping framework, like the one that was discussed in class. The scraping framework should be able to get a configuration file (use yaml as a format) that will describe how to scrape a website. Think about what such configuration should hold and represent. The platform will be able to scrape a new website and insert all of its data to the DB using only the configuration file, and without any changes to code. Once you have managed to to build this framework, test it by creating configuration files that will scrape the following sites:
https://ideone.com
https://paste.scratchbook.ch
https://pastebin.com


Project Presentation
You are required to present your work and achievements to the mentors. You should create a few slides that will depict the following:
The architecture that you’ve chosen for the project. You can use https://draw.io/ to create an architectural diagram. See references online for how a software architecture diagram should look like
The challenges that you’ve faced, and how you overcame them
The lessons you’ve learned from the experience
Include a few screenshots of the platform, and describe in high level what does it do (subject to how much of the bonuses phases you’ve completed)





Good luck!
Some examples of pastes from the website. The content changes every day.









About IntSights
IntSights is revolutionizing cybersecurity operations with the industry’s only all-in-one external threat protection platform designed to neutralize cyberattacks outside the wire. Our unique cyber reconnaissance capabilities enable continuous monitoring of an enterprise’s external digital profile across the open, deep, and dark web to identify emerging threats and orchestrate proactive response. Tailored threat intelligence that seamlessly integrates with security infrastructure for dynamic defense has made IntSights one of the fastest-growing cybersecurity companies in the world. IntSights has offices in Amsterdam, Boston, Dallas, New York, Singapore, Tel Aviv, and Tokyo. 

To learn more, visit: https://www.intsights.com.
