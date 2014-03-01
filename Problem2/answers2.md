1. This is a fairly simple table -- it lists years against the institution collecting data/the year it was collected.  The data itself is simple numbers.   Some differences from previous data we've dealt with is that there are gaps (not every institution collected data for every year) and some of the entries are fuzzy (x to y; not a certain number).

2. 
	* $("table tr:nth-of-type(2)") should get you the second row in the table; this only works because it's the only table in the document, though; if there were others, you might need to get more specific.
	
	* $("table tr:has(td)") should get you all the table rows containing data cells (but not those containing table headers).