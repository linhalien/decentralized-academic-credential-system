import { Course, DisclosedCourse } from "@credchain/shared/types";
import { buildMerkleTree, MerkleTreeResult } from "./buildMerkleTree";

export function generateProof(
  treeResult: MerkleTreeResult,
  selectedCourseNames: string[]
): DisclosedCourse[] {
  const { tree, courses } = treeResult;

  if (selectedCourseNames.length === 0) {
    throw new Error("At least one course must be selected for disclosure");
  }

  const courseByName = new Map(courses.map((c) => [c.name, c]));
  const disclosed: DisclosedCourse[] = [];

  for (const name of selectedCourseNames) {
    const course = courseByName.get(name);
    if (!course) {
      throw new Error(`Course not found in credential: ${name}`);
    }

    const leafIndex = tree.leafLookup([course.name, course.grade, course.salt]);
    const proof = tree.getProof(leafIndex);

    disclosed.push({
      name: course.name,
      grade: course.grade,
      salt: course.salt,
      proof,
    });
  }

  return disclosed;
}

export function generateProofFromCourses(
  courses: Course[],
  selectedCourseNames: string[]
): DisclosedCourse[] {
  const treeResult = buildMerkleTree(courses);
  return generateProof(treeResult, selectedCourseNames);
}

if (require.main === module) {
  const fs = require("fs");

  const inputPath = process.argv[2];
  const selectedNames = process.argv.slice(3);

  if (!inputPath || selectedNames.length === 0) {
    console.error(
      "Usage: ts-node holder/generateProof.ts <credential.json> <courseName> [courseName...]"
    );
    process.exit(1);
  }

  const credential = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const courses: Course[] = credential.bundle?.courses ?? credential.courses;

  if (!courses?.every((c: Course) => c.salt)) {
    console.error("Courses must have salts — run holder:tree first");
    process.exit(1);
  }

  const disclosed = generateProofFromCourses(courses, selectedNames);
  const output = {
    merkleRoot: credential.merkleRoot,
    disclosedCourses: disclosed,
  };

  console.log(JSON.stringify(output, null, 2));
}
