import { chance } from "@utilities/constants";
import { getRandomEntityType } from "@utilities/functions";
import { Then } from "@utilities/testing";
import { EntityType } from "../../../../types/api";
import { AttributeSchema, ICommon } from "../../types/attributes";
import { Attributes } from "../attributes";

describe("Attributes", () => {

	let entityType: EntityType;
	let id: string;
	let created: string;
	let modified: string;
	let discontinued: boolean;
	let attribute: string;
	let attribute1: number;
	let attribute2: boolean;

	type A = ICommon & {
		attribute: AttributeSchema<string>,
		attribute1: AttributeSchema<number>,
		attribute2: AttributeSchema<boolean>,
	};

	type S = ICommon & {
		set: AttributeSchema<Record<string, any>>
	};

	type SA = ICommon & {
		array: AttributeSchema<Array<any>>
	}

	type PA = Omit<A, "attribute1" | "attribute2">; // partial A

	beforeEach(() => {
		entityType = getRandomEntityType();
		id = chance.fbid();
		created = chance.date().toJSON();
		modified = chance.date().toJSON();
		discontinued = chance.bool();
		attribute = "string";
		attribute1 = 1;
		attribute2 = true;
	});

	test("Base attributes", () => {
		const attributes = new Attributes({});
		attributes.parse({ entityType, id });
		expect(attributes.collective()).toMatchObject({
			entityType,
			id,
			created: Then.dateMatch(),
			modified: null,
			discontinued: false
		});
	});

	test("Explicit base attributes", () => {

		const attributes = new Attributes<A>({
			attribute: { initial: null },
			attribute1: { initial: null },
			attribute2: { initial: null }
		});

		attributes.parse({
			entityType, id, created, modified, discontinued,
			attribute,
			attribute1,
			attribute2
		});

		expect(attributes.collective()).toMatchObject({
			entityType,
			id,
			created: Then.dateMatch(),
			modified: Then.dateMatch(),
			discontinued,
			attribute,
			attribute1,
			attribute2
		});

	});

	test("Attributes.get", () => {

		const values = { entityType, id, created, modified, discontinued, attribute };
		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });

		attributes.parse(values);

		for (const key in values) {
			expect(attributes.get(key as keyof typeof values)).toBe(values[key]);
		};

	});

	test("Attributes.set", () => {
		const attributes = new Attributes<PA>({ attribute: { initial: null } });
		attributes.set({ attribute });
		expect(attributes.collective()).toMatchObject({
			modified: Then.dateMatch(),
			attribute
		});
	});

	test("Attributes.putable true", () => {
		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });
		attributes.parse({ entityType, id, attribute });
		expect(attributes.putable()).toBe(true);
	});

	test("Attributes.putable false", () => {
		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });
		attributes.parse({ entityType, id });
		expect(attributes.putable()).toBe(false);
	});

	test("Attributes.valid", () => {

		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });
		attributes.parse({ entityType, id });
		
		const collectiveNonNullAttributes = attributes.valid();
		const nullAttributes: Array<keyof ReturnType<typeof attributes.collective>> = ["attribute"];

		nullAttributes.forEach(attribute => expect(attribute in collectiveNonNullAttributes).toBe(false));

	});

	test("Attribute.(set & override) sets(object)", () => {

		const attributes = new Attributes<S>({ set: { initial: {}, required: true }});

		attributes.set({
			set: {
				attribute
			}
		});

		expect(attributes.get("set")).toMatchObject({ attribute });

		attributes.set({
			set: {
				attribute1, attribute2
			}
		});

		expect(attributes.get("set")).toMatchObject({ attribute, attribute1, attribute2 });

		attributes.override({
			set: {}
		});

		expect(attributes.get("set")).toMatchObject({});

	});

});