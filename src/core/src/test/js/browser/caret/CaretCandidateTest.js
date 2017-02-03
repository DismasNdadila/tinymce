asynctest('browser.tinymce.core.CaretCandidateTest', [
	'ephox.mcagar.api.LegacyUnit',
	'ephox.agar.api.Pipeline',
	'tinymce.core.Env',
	'tinymce.core.caret.CaretCandidate',
	'tinymce.core.dom.DomQuery',
	'tinymce.core.text.Zwsp',
	'tinymce.core.test.ViewBlock',
	'global!document'
], function (LegacyUnit, Pipeline, Env, CaretCandidate, $, Zwsp, ViewBlock, document) {
	var success = arguments[arguments.length - 2];
	var failure = arguments[arguments.length - 1];
	var suite = LegacyUnit.createSuite();
	var viewBlock = new ViewBlock();

	if (!Env.ceFalse) {
		return;
	}

	var getRoot = function () {
		return viewBlock.get();
	};

	var setupHtml = function (html) {
		viewBlock.update(html);
	};

	suite.test('isCaretCandidate', function () {
		$.each("img input textarea hr table iframe video audio object".split(' '), function (index, name) {
			LegacyUnit.equal(CaretCandidate.isCaretCandidate(document.createElement(name)), true);
		});

		LegacyUnit.equal(CaretCandidate.isCaretCandidate(document.createTextNode('text')), true);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate($('<span contentEditable="false"></span>')[0]), true);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate($('<div contentEditable="false"></div>')[0]), true);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate($('<table><tr><td>X</td></tr></table>')[0]), true);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate($('<span contentEditable="true"></span>')[0]), false);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate($('<span></span>')[0]), false);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate(document.createComment('text')), false);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate($('<span data-mce-caret="1"></span>')[0]), false);
		LegacyUnit.equal(CaretCandidate.isCaretCandidate(document.createTextNode(Zwsp.ZWSP)), false);
	});

	suite.test('isInEditable', function () {
		setupHtml('abc<span contentEditable="true"><b><span contentEditable="false">X</span></b></span>');
		LegacyUnit.equal(CaretCandidate.isInEditable($('span span', getRoot())[0].firstChild, getRoot()), false);
		LegacyUnit.equal(CaretCandidate.isInEditable($('span span', getRoot())[0], getRoot()), true);
		LegacyUnit.equal(CaretCandidate.isInEditable($('span', getRoot())[0], getRoot()), true);
		LegacyUnit.equal(CaretCandidate.isInEditable(getRoot().firstChild, getRoot()), true);
	});

	suite.test('isAtomic', function () {
		$.each(["img", "input", "textarea", "hr"], function (index, name) {
			LegacyUnit.equal(CaretCandidate.isAtomic(document.createElement(name)), true);
		});

		LegacyUnit.equal(CaretCandidate.isAtomic(document.createTextNode('text')), false);
		LegacyUnit.equal(CaretCandidate.isAtomic($('<table><tr><td>X</td></tr></table>')[0]), false);
		LegacyUnit.equal(CaretCandidate.isAtomic($('<span contentEditable="false">X</span>')[0]), true);
		LegacyUnit.equal(CaretCandidate.isAtomic(
			$('<span contentEditable="false">X<span contentEditable="true">Y</span>Z</span>')[0]), false
		);
	});

	suite.test('isEditableCaretCandidate', function () {
		setupHtml('abc<b>xx</b><span contentEditable="false"><span contentEditable="false">X</span></span>');
		LegacyUnit.equal(CaretCandidate.isEditableCaretCandidate(getRoot().firstChild, getRoot()), true);
		LegacyUnit.equal(CaretCandidate.isEditableCaretCandidate($('b', getRoot())[0]), false);
		LegacyUnit.equal(CaretCandidate.isEditableCaretCandidate($('span', getRoot())[0]), true);
		LegacyUnit.equal(CaretCandidate.isEditableCaretCandidate($('span span', getRoot())[0]), false);
	});

	viewBlock.attach();
	Pipeline.async({}, suite.toSteps({}), function () {
		viewBlock.detach();
		success();
	}, failure);
});
