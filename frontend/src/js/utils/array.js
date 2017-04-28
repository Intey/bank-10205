export function intersect(a, b) {
	var ai=0, bi=0
	var result = []

	while( ai < a.length && bi < b.length )
		{
			if      (a[ai] < b[bi] ){ ai++ }
			else if (a[ai] > b[bi] ){ bi++ }
			else /* they're equal */
			{
				result.push(a[ai])
				ai++
				bi++
			}
		}
		return result
}

/** Remove empty or undefined elements in array and return new array
 * @param {Array} array of elements.
 */
export function clear(array) {
    return array.filter( e => e && e != "" );
}
