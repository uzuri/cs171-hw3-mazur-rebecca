Design Studio Analysis
----------------------

* Trends: In general, population is trending up, and very fast.  
* More recent absolute numbers and projections are considerably closer in estimates than ancient numbers. 
* Absolute differences are actually far worse in current numbers and projectsion -- but this isn't the case in relative terms (100,000,000 in uncertainty isn't so much when you've got 9,000,000,000 people, but it looks like an incredible mistake if you're only got 300,000,000).
* Because we're dealing with such a huge span of numbers, the diffences between the lines aren't obvious if you're just eyeballing it; that makes it difficult to put them in the same graph.  It could be done with some sort of encoding on the data points -- let's say that the "more uncertain" numbers have a low opacity and the "more certain" numbers are fully opaque.  This still wouldn't be realy easy to read on the graph, though, as we still have a lot of bunching and overwriting.   You might also be able to do it by size of the marker, making the marker look like an uncertainty bar.  Still, neither of these are all that great.  I'd rather see an interactive graph where you can move back and forth between data and uncertainty.  Two graphs (one for data and one for uncertainty) set one over the other and with the same scale might be of use -- you could see the two together in a manner that lines up visually.  This may be actually useful; I'd say it ties with the interactive graph, or would win in a situation where you couldn't have an interactive graph.
* Linear interpolation emphasizes uncertainty in places where it might not really exist (you can't really talk about uncertainty if you're just making up numbers).  A polynomial interpolation might give you a better fit to the data.
* It's acceptable, but there are probably better.  


Implementation Arguments
------------------------

I ended up doing the multple views (trendlines, number vs. average, percentage vs. average) because I felt that that gives you the best context for what you're looking at.  

Note that I used a slightly different scrape to ease calculations on the graph -- dataExportWikiwithaverage.html calculates and includes the Average as a column in the csv it creates.  This makes it very easy to display it and use it to calculate the diffs.