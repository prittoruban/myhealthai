import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

interface Recipe {
  dishName: string;
  ingredients: string[];
  oilUsed: string;
  quantityInMl: number;
  cookingMethod: string;
  healthTips: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dishName = searchParams.get('dishName');

    if (!dishName) {
      return NextResponse.json(
        { error: 'Dish name is required' },
        { status: 400 }
      );
    }

    // Read recipes from local JSON file
    const recipesPath = path.join(process.cwd(), 'data', 'recipes.json');

    if (!fs.existsSync(recipesPath)) {
      return NextResponse.json(
        { error: 'Recipe database not found' },
        { status: 500 }
      );
    }

    const recipesData = fs.readFileSync(recipesPath, 'utf-8');
    const recipes: Recipe[] = JSON.parse(recipesData);

    // Search for matching recipe (case-insensitive)
    const recipe = recipes.find(
      (r) => r.dishName.toLowerCase() === dishName.toLowerCase()
    );

    if (!recipe) {
      return NextResponse.json(
        {
          message: 'No low-oil recipe found for this dish',
          suggestion: 'Try searching for popular Indian dishes like Dosa, Idli, Dal, or Curry',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      recipe,
    });
  } catch (error) {
    console.error('Recipe fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
