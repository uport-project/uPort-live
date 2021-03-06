# Development Notes

This is just a document for keeping track of random thoughts during the development process, stumbling blocks, small changes, inconsistencies etc.  This will supplement the commit logs with some more detail to avoid losing minor changes to the wind, keep style/conventions consistent, and keep track of unfruitful lines of inquiry to avoid repeated work.  This will be organized generally as stream of consciousness / note taking, and may not be the most organized, but written down is better than forgotten!

In particular, I'm creating this while on an 8 hour flight with no internet, so without github issues, this is the next best thing, and hey it might come in handy even when the internet comes back !

## 7/3/18 Rob
- Lots of style improvements are underway/completed, so the next item of business is making the whole app a little more **cool**.  Proposal: replace ethr-did's with muport did's, so that we can create a did-doc for each event and publish it's location/description etc. 
	- Aside: what if you're issuing credentials to a private event? Would the location/details be a problem?  People wouldn't really find it unless they knew where to look but still is public... things to think about
- In particular, using a muport-did will let us attach an image which will be displayed along with any credentials issued by the app, nifty
- TODO: Set up an alternative event creation flow that uses muport-core and ipfs-api to create a muport id with did-doc, upload an image to ipfs, and link to that image in the did-doc

## 6/29/18 Rob
- Reorganized components into a slightly more sane structure, hopefully this will save headaches down the road/will be more easy to understand.
- TODO: Better handling for redirects and landing page stuff
	- Need to gracefully redirect if someone goes to `/checkin` without clicking on an event
	- Need to throw up a spinner or some other blocking animation between login and dashboard
		- Maybe something similar for new events, and checkin
	- Better definition for the checkin flow, i.e. make it more clear that there are two steps, maybe put the login button on the page to save a click?
		- Also maybe show some stylized version of the attestation on the side of the checkin page?
- Homepage for logged in users should be different than not logged in
	- Probably dashboard for logged in (?)
	- Some sort of about/landing page otherwise?

## 6/22/18 Rob
- Biggest change of last two days: scrap the lambda functions, uport-live itself will no longer be the signer for event attendance attestations.  It will issue event ownership credentials, but the fact of the app issuing these is pretty inconsequential as they now contain a keypair using the ethr-did library!  So the keypair is stored inside the ownership credential, and then in the checkin flow, it is the *event* that does the signing.
	- In an ideal world, the user would make the event a signing delegate or something similar, but until all of that functionality is ready, we can just use this event-as-identity hack.  The checkin flow is then a new instance of `Connect`, which requests credentials from the checking-in user, and then pushes them an attendance verification
- The currently-checking-in-event will be a branch of the redux state tree, so the checkin flow is initiated by emmitting an action that saves the desired event ownership claim to that branch, and redirects to the checkin component, which simply loops on checking people in until the checkin flow is ended with another Action.

## 6/18/18 Rob
- Trying to implement the lambda functions that can replace our event ownership attestation creator, but struggling a bit at the moment.  I think the most difficult/confusing piece is straddling between uport-connect and uport-js, in that we want to request credentials on the client side, but not have to log users in a second time when they are issued a credential by the lambda function.  Here's what I know so far:
	- 'Logging a user in' amounts to making a `uport.requestCredentials()` call, and getting the basic info of the user after they scan the QR and approve the login request
	- Issuing a credential requires the address (mnid) of the user to receive it, and can be bestowed upon the lovely user either by making a push with pututu (but this requires a `pushToken`) or by displaying another QR
		- In the QR case, we could easily send the user's mnid and the claim to be issued (i.e. the event description) to the lambda function, and send back a uri that we can make into a QR code, just needs a little more translating in between
		- In the (preferred) push case, we need to get a push token somehow and get that to the lambda function.  From the documentation alone (I haven't tested) It appears that uport-connect doesn't get `pushToken`s, so to avoid the second QR scan, we would need to... make another call to `requestCredentials` requiring another QR scan.  UNLESS uport-connect actually does give us a `pushToken`, then we can just send that along with the request to the lambda function and do the push from there. 
	- My vote is that two scans is unacceptably cumbersome, so we need to either get a pushToken with the login, or encapsulate the login as a lambda function as well so it can be done from uport-js.  I have a hard time believing that this functionality would just be missing from uport-connect though, so it may not be necessary.
		- ** Given that I am still on a plane and can't test this, I'm going to assume we can get a pushToken on the client side and then parse it in the lambda function **
		- WOW writing things down really helps unravel this mess, thanks notes.
- Now thinking a little bit more about the problem of protecting the attendance attestations from forgery, I'm not sure we can do this cleanly without requiring the event owner to intervene every time an attendance credential is issued.  That is, our original plan was that the owner would sign the claim and send it to the attendane issuing lambda function, which could confirm that the `organizer` field (an mnid) did in fact sign the sent claim.  However, seeing as the application won't have the private key of the organizer, we can't sign arbitrarily many claims without requiring lots of intervention from the organizer, which is prohibitively annoying.  Potential solution that may be overly complicated but may also be elegant (someone let me know which):
	- Rather than using user addresses, generate a _new keypair_ for every event!

## 6/13/18 Rob
- Doing some style cleanup
	- Combing through the CSS on the project, looks like 'pure' is a CSS framework that ships with the truffle box.  There isn't a whole lot of dependence on this at the moment, so I am going to try to exorcise it to get rid of some of the jankyness.  Whether or not we stay with semantic as a css framework, we definitely need pure out of the way.  Also arial narrow looks terrible, swapping out Open Sans until we have a better idea.
	- Updating the LoginButtonContainer to accept children, got sick of hacking out different cases of the login button, so now you can specify the contents of the login button directly (e.g. does it contain the logo, what is the button's text, etc.)
	- Feeling like the global CSS folder is going to get icky, and it feels more in the mindset of react to keep CSS alongside the components.  Without pure, the only global css is App.css, index.css, and the stub for Open Sans.  open-sans.css is going into the fonts folder, css folder is getting axed, and individual components will get their styles right next to them.
- Architecture musings
	- So when we swap out the signing with uport-connect for a lambda function, we're going to need some way of authenticating the request that is made to the lambda service.  If it's not a full server, we can't very well to standard CSRF token passing, but maybe we can design the service itself so that it just... works ? Aka the integrity of the credentials are such that forging a request to the lambda function is as detectable as creating a bogus event to begin with.  Something sent to the server should be signed by the uport user, so that the lambda function can check for the fact that the signing party is the same as the address inside the request.  If a different user tries to forge a request, the owner field and the signature will not match.
- Other thoughts looking forward
	- We'll need some sort of about/explainer page to pitch the concept, either as a separate page or below the splash / login area. This could probably just be a markdown file which we can include into the site with a react-markdown importer.  This can then double as an info page to link to on the github/elsewhere and will be easily editable by non-technical team members
	- More vision for the dashboard page / list of events:
	- Potential issue: many people will likely organize very few events, so their dashboards will be quite empty.  How do we set up the layout so as not to look totally barren for these users? related: down the line, we may want the dashboard to be tabbed according to the types of attestations being issued, (events, stickers, arbitrary other pieces of data you want to issue to others).  On the technical side, these different types of attestations can be categorized by different primary keys in the claim (i.e. expanding beyond UPORT_LIVE_EVENT)
	- After we begin issuing attestations for attendance etc., we'll want to expand the dashboard functionality to show attestations received as well as those created.  Some sort of organized version of the uport mobile claims dashboard?
- Note on code style: I've seen some other repos in uPort using StandardJS for style, and haven't run into another style guide, so I think that's the one to use.  When I get a chance I'll try to configure the linter to style check for Standard, but in brief: no semicolons


