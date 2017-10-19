import { expect } from 'chai'
import { update, copyarray, updatearray, removearrayelem } from '../src/immutable'

describe('immutable', function() {
    it('update', function() {
	const oldObj = { foo: "hello", bar:'hello2' };
	const newObj = update(oldObj, 'foo', 'bar');
	expect(newObj.foo).to.equal('bar');
    })
    it('copyarray', function() {
	const ar = [5,6,7,8,9];
	const newar = copyarray(ar);
	expect(newar[2]).to.equal(7);
	expect(newar[0]).to.equal(5);
    })
    it('updatearray', function() {
	const ar = [5,6,7,8,9];
	const newar = updatearray(ar,2,10);
	expect(newar[2]).to.equal(10);
	expect(newar[0]).to.equal(5);
    })
    it('removearrayelem', function() {
	const ar = [5,6,7,8,9];
	const newar = removearrayelem(ar,2);
	expect(newar[2]).to.equal(8);
	expect(newar).to.have.lengthOf(4)
    })
})
