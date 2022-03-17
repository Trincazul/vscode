/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from 'vs/base/browser/dom';
import { ICellViewModel } from 'vs/workbench/contrib/notebook/browser/notebookBrowser';
import { CellViewModelStateChangeEvent } from 'vs/workbench/contrib/notebook/browser/notebookViewEvents';
import { CellPart } from 'vs/workbench/contrib/notebook/browser/view/cellParts/cellPart';
import { BaseCellRenderTemplate } from 'vs/workbench/contrib/notebook/browser/view/notebookRenderingCommon';

export class CellDecorations extends CellPart {
	constructor(
		readonly rootContainer: HTMLElement,
		readonly decorationContainer: HTMLElement,
	) {
		super();
	}

	renderCell(element: ICellViewModel, templateData: BaseCellRenderTemplate): void {
		const removedClassNames: string[] = [];
		this.rootContainer.classList.forEach(className => {
			if (/^nb\-.*$/.test(className)) {
				removedClassNames.push(className);
			}
		});

		removedClassNames.forEach(className => {
			this.rootContainer.classList.remove(className);
		});

		this.decorationContainer.innerText = '';

		const generateCellTopDecorations = () => {
			this.decorationContainer.innerText = '';

			element.getCellDecorations().filter(options => options.topClassName !== undefined).forEach(options => {
				this.decorationContainer.append(DOM.$(`.${options.topClassName!}`));
			});
		};

		templateData.elementDisposables.add(element.onCellDecorationsChanged((e) => {
			const modified = e.added.find(e => e.topClassName) || e.removed.find(e => e.topClassName);

			if (modified) {
				generateCellTopDecorations();
			}
		}));

		generateCellTopDecorations();
	}

	prepareLayout(): void {
	}

	updateInternalLayoutNow(element: ICellViewModel): void {
	}

	updateState(element: ICellViewModel, e: CellViewModelStateChangeEvent): void {
	}
}
