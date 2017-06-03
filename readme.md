Splunkstr - customizable chrome extension for Splunk work
====================================================

The purpose of this chrome extension is to help analysts using Splunk, by enabling them to access their favorite queries by selecting some text and picking a saved query from the right click menu.

It works by grabbing an active Splunk query using the url from an active Splunk page and saving it after you define your variable using $$$ on either side.

Usage
-----

1. Grab the query using the "Grab query button" accessible from the Splunkstr icon in the toolbar.
1. Locate and mark your variable in the query url using $$$ on either side.
1. Name your query.
1. Save using the "Save query button".

Ex. Grab and edit "long splunk query containing my variable user name rest of query".
Add $$$ on either side of your variable resulting in: "long splunk query containing my variable $$$user name$$$ rest of query.


install
-------
The plan is to get Splunkstr into the chrome web store as a free and open source extension, but until then you can install this extension manually in developer mode.