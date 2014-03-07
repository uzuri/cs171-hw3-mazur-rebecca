1. It adds a group (g) with the class "brush" for the interactive area.

2. It adds a rectangle of class extent to handle the selected area.

3. 
	* rect.background appears to mostly be for styling -- so you can shade the selected area and outline it.
	* g.resize/e is a group containing a rectangle that triggers if you put your cursor close to the width edge of the background rectangle to show you you can resize it. 
	* g.resize/w appears to do the same a g.resize/e, only for the height (we're forcing the height, though, so in this case it isn't used)
