import React, { useState } from "react";
import {
  Search,
  Database,
  Check,
  X,
  AlertCircle,
  Loader2,
  Fish as FishIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ApiResponse {
  gbif: any;
  iucn: any;
  semantyfish: any;
}

interface LoadingState {
  gbif: boolean;
  iucn: boolean;
  semantyfish: boolean;
}

interface ErrorState {
  gbif: string | null;
  iucn: string | null;
  semantyfish: string | null;
}

export function ApiTestLab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [enabledSources, setEnabledSources] = useState({
    gbif: true,
    iucn: true,
    semantyfish: true,
  });

  const [apiData, setApiData] = useState<ApiResponse>({
    gbif: null,
    iucn: null,
    semantyfish: null,
  });

  const [loading, setLoading] = useState<LoadingState>({
    gbif: false,
    iucn: false,
    semantyfish: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    gbif: null,
    iucn: null,
    semantyfish: null,
  });

  const [activeTab, setActiveTab] = useState<
    "normalized" | "gbif" | "iucn" | "semantyfish"
  >("normalized");
  const [showMappingTable, setShowMappingTable] = useState(false);

  const fetchGBIFChecklistOnly = async (scientificName: string) => {
    setLoading((prev) => ({ ...prev, gbif: true }));
    setErrors((prev) => ({ ...prev, gbif: null }));

    try {
      const datasetKey = "7a62e189-0e05-45c4-aabe-320d001ed31b";
      const trimmed = scientificName.trim();
      const canonical = trimmed.split(/\s+/).slice(0, 2).join(" ");

      const queries = [...new Set([trimmed, canonical].filter(Boolean))];

      const attempts = await Promise.all(
        queries.map(async (q) => {
          const response = await fetch(
            `https://api.gbif.org/v1/species/search?datasetKey=${datasetKey}&q=${encodeURIComponent(q)}&limit=10`,
          );

          if (!response.ok) {
            throw new Error(`GBIF checklist search failed: ${response.status}`);
          }

          const data = await response.json();

          return {
            queryUsed: q,
            data,
          };
        }),
      );

      const bestMatch = attempts.find((item) => item?.data?.count > 0) || null;

      const result = {
        mode: "malaysia_checklist_only",
        scientificNameUsed: scientificName,
        malaysiaAttempts: attempts,
        malaysia: bestMatch?.data || { count: 0, results: [] },
        malaysiaMatchedBy: bestMatch?.queryUsed || null,
      };

      setApiData((prev) => ({
        ...prev,
        gbif: result,
      }));

      return result;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        gbif:
          error instanceof Error
            ? error.message
            : "Failed to check GBIF Malaysia checklist",
      }));
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, gbif: false }));
    }
  };

  const fetchIUCN = async (scientificName: string) => {
    setLoading((prev) => ({ ...prev, iucn: true }));
    setErrors((prev) => ({ ...prev, iucn: null }));

    try {
      // Parse scientific name into genus and species
      const parts = scientificName.split(" ");
      const genus = parts[0] || "";
      const species = parts[1] || "";
      const infra = parts.slice(2).join(" ");

      // Note: Using placeholder for API key - in production, this should be handled by backend
      const apiKey = "YOUR_IUCN_API_KEY_HERE";

      let url = `https://api.iucnredlist.org/api/v4/taxa/scientific_name?genus_name=${encodeURIComponent(genus)}&species_name=${encodeURIComponent(species)}`;
      if (infra) {
        url += `&infra_name=${encodeURIComponent(infra)}`;
      }

      // Mock response for now since we don't have a real API key
      setApiData((prev) => ({
        ...prev,
        iucn: {
          note: "IUCN API requires authentication. In production, use backend proxy with API key.",
          requestUrl: url,
          mockData: {
            category: "Least Concern",
            populationTrend: "Stable",
            habitat: "Freshwater",
            message: "Replace with actual IUCN API call",
          },
        },
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        iucn:
          error instanceof Error ? error.message : "Failed to fetch IUCN data",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, iucn: false }));
    }
  };

  const fetchJson = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  };

  const looksLikeScientificName = (value: string) => {
    const trimmed = value.trim();
    return /^[A-Z][a-z]+(?:\s[a-z-]+){1,2}$/.test(trimmed);
  };

  const fetchSemantyFishSpeciesById = async (id: string | number) => {
    return fetchJson(
      `/api/semantyfish/resources/species/${encodeURIComponent(String(id))}`,
    );
  };

  const searchSemantyFishScientific = async (query: string) => {
    return fetchJson(
      `/api/semantyfish/resources/search_species?scientific_name=${encodeURIComponent(query)}`,
    );
  };

  const searchSemantyFishCommon = async (query: string) => {
    return fetchJson(
      `/api/semantyfish/resources/search_common_names?common_name=${encodeURIComponent(query)}`,
    );
  };

  const fetchSemantyFishCommonNameDetail = async (id: string | number) => {
    return fetchJson(
      `/api/semantyfish/resources/common_name/${encodeURIComponent(String(id))}`,
    );
  };

  const fetchSemantyFish = async (query: string, id?: string) => {
    setLoading((prev) => ({ ...prev, semantyfish: true }));
    setErrors((prev) => ({ ...prev, semantyfish: null }));

    try {
      const trimmedQuery = query.trim();

      if (id?.trim()) {
        const species = await fetchSemantyFishSpeciesById(id.trim());

        const result = {
          searchMode: "species_id",
          selectedSpecies: species,
          rawSpeciesResponse: species,
        };

        setApiData((prev) => ({
          ...prev,
          semantyfish: result,
        }));

        return result;
      }

      const runScientificLookup = async () => {
        const searchData = await searchSemantyFishScientific(trimmedQuery);
        const results = Array.isArray(searchData?.results)
          ? searchData.results
          : Array.isArray(searchData)
            ? searchData
            : [];

        const first = results[0];
        const speciesCode =
          first?.id ?? first?.species_code ?? first?.species?.species_code;

        if (!speciesCode) return null;

        const species = await fetchSemantyFishSpeciesById(speciesCode);

        return {
          searchMode: "scientific_name",
          rawSearchResponse: searchData,
          matchedResults: results,
          selectedSpecies: species,
        };
      };

      const runCommonNameLookup = async () => {
        const searchData = await searchSemantyFishCommon(trimmedQuery);
        const results = Array.isArray(searchData?.results)
          ? searchData.results
          : [];

        if (!results.length) return null;

        const commonNameDetails = await Promise.all(
          results
            .slice(0, 5)
            .map((item: any) => fetchSemantyFishCommonNameDetail(item.id)),
        );

        const speciesCodes = [
          ...new Set(
            commonNameDetails
              .map((item: any) => item?.species?.species_code)
              .filter(Boolean),
          ),
        ];

        if (!speciesCodes.length) {
          return {
            searchMode: "common_name",
            rawSearchResponse: searchData,
            commonNameDetails,
            speciesProfiles: [],
            selectedSpecies: null,
          };
        }

        const speciesProfiles = await Promise.all(
          speciesCodes.map((code) => fetchSemantyFishSpeciesById(code)),
        );

        return {
          searchMode: "common_name",
          rawSearchResponse: searchData,
          commonNameDetails,
          speciesProfiles,
          selectedSpecies: speciesProfiles[0] ?? null,
        };
      };

      let result = null;

      if (looksLikeScientificName(trimmedQuery)) {
        result = (await runScientificLookup()) ?? (await runCommonNameLookup());
      } else {
        result = (await runCommonNameLookup()) ?? (await runScientificLookup());
      }

      if (!result?.selectedSpecies) {
        throw new Error("No SemantyFish species match found.");
      }

      setApiData((prev) => ({
        ...prev,
        semantyfish: result,
      }));

      return result;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        semantyfish:
          error instanceof Error
            ? error.message
            : "Failed to fetch SemantyFish data",
      }));
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, semantyfish: false }));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !speciesId.trim()) return;

    let resolvedScientificName = searchQuery.trim();
    let semantyResult: any = null;

    if (enabledSources.semantyfish) {
      semantyResult = await fetchSemantyFish(
        searchQuery,
        speciesId || undefined,
      );
      resolvedScientificName =
        semantyResult?.selectedSpecies?.scientific_name ||
        resolvedScientificName;
    }

    if (enabledSources.gbif && resolvedScientificName) {
      await fetchGBIFChecklistOnly(resolvedScientificName);
    }

    if (enabledSources.iucn && resolvedScientificName) {
      await fetchIUCN(resolvedScientificName);
    }
  };

  const toggleSource = (source: "gbif" | "iucn" | "semantyfish") => {
    setEnabledSources((prev) => ({ ...prev, [source]: !prev[source] }));
  };

  // Normalize data from all sources
  const getNormalizedData = () => {
    const gbifChecklistData = apiData.gbif?.malaysia?.results?.[0] || {};
    const iucnData = apiData.iucn?.mockData || {};

    const semantyfishSpecies =
      apiData.semantyfish?.selectedSpecies ??
      apiData.semantyfish?.speciesProfiles?.[0] ??
      null;

    const semantyfishCommonName =
      apiData.semantyfish?.commonNameDetails?.[0]?.common_name ?? null;

    const semantyfishData = semantyfishSpecies || {};

    const familyName =
      semantyfishData?.family?.family_name ||
      semantyfishData?.family?.name ||
      gbifChecklistData?.family ||
      "N/A";

    const genusName =
      semantyfishData?.genus?.genus_name ||
      semantyfishData?.genus?.name ||
      gbifChecklistData?.genus ||
      "N/A";

    const maxLengthDimension = Array.isArray(semantyfishData?.dimensions)
      ? semantyfishData.dimensions.find((d: any) => d?.type === "max length")
      : null;

    const maxWeightDimension = Array.isArray(semantyfishData?.dimensions)
      ? semantyfishData.dimensions.find((d: any) => d?.type === "max weight")
      : null;

    const longevityWild = Array.isArray(semantyfishData?.dimensions)
      ? semantyfishData.dimensions.find(
          (d: any) => d?.type === "longevity wild",
        )
      : null;

    const longevityCaptive = Array.isArray(semantyfishData?.dimensions)
      ? semantyfishData.dimensions.find(
          (d: any) => d?.type === "longevity captive",
        )
      : null;

    const aquariumDemandValue =
      semantyfishData?.aquarium_demand?.value || "N/A";

    const aquariumDemandDetails =
      semantyfishData?.aquarium_demand?.details || "N/A";

    return {
      commonName:
        semantyfishData?.common_name ||
        semantyfishData?.vernacular_name ||
        semantyfishCommonName ||
        gbifChecklistData?.vernacularName ||
        "N/A",

      scientificName:
        semantyfishData?.scientific_name ||
        gbifChecklistData?.scientificName ||
        searchQuery ||
        "N/A",

      family: familyName,
      genus: genusName,
      subspecies: gbifChecklistData?.infraspecificEpithet || "N/A",

      type: semantyfishSpecies
        ? "Fish"
        : gbifChecklistData?.class === "Reptilia"
          ? "Turtle"
          : "Unknown",

      inMalaysiaChecklist: apiData.gbif?.malaysia?.count > 0,

      iucnStatus: iucnData.category || "Not Evaluated",
      populationTrend: iucnData.populationTrend || "Unknown",

      habitat:
        semantyfishData?.preferred_environment ||
        iucnData.habitat ||
        gbifChecklistData?.habitat ||
        "N/A",

      distribution:
        semantyfishData?.distribution ||
        gbifChecklistData?.higherGeography ||
        "N/A",

      bodyShape: semantyfishData?.body_shape || "N/A",

      colors: semantyfishData?.coloration || "N/A",

      maxLength: maxLengthDimension
        ? `${maxLengthDimension.value} ${maxLengthDimension.unit || ""}`.trim()
        : "N/A",

      maxWeight: maxWeightDimension
        ? `${maxWeightDimension.value} ${maxWeightDimension.unit || ""}`.trim()
        : "N/A",

      lifespan: longevityCaptive
        ? `${longevityCaptive.value} ${longevityCaptive.unit || ""}`.trim()
        : longevityWild
          ? `${longevityWild.value} ${longevityWild.unit || ""}`.trim()
          : "N/A",

      diet: semantyfishData?.comments || "N/A",
      activity: semantyfishData?.migration_type || "N/A",

      cites: "N/A",

      aquariumDemand: aquariumDemandValue,
      aquariumDemandDetails,
    };
  };

  const normalized = getNormalizedData();

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-[1800px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-2 flex items-center gap-3">
            <Database className="w-10 h-10 text-emerald-600" />
            Species API Test Lab
          </h1>
          <p className="text-stone-600 text-lg">
            Test and preview species data from GBIF, IUCN Red List, and
            SemantyFish APIs
          </p>
        </div>

        {/* Main Layout: Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Controls + Raw JSON */}
          <div className="space-y-6">
            {/* Search Controls */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
              <h2 className="text-xl font-bold text-stone-900 mb-4">
                Search Controls
              </h2>

              {/* Search Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Scientific or Common Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="e.g., Carassius auratus or Goldfish"
                    className="w-full px-4 py-3 pl-12 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                </div>
              </div>

              {/* Species ID Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Species ID (SemantyFish)
                </label>
                <input
                  type="text"
                  value={speciesId}
                  onChange={(e) => setSpeciesId(e.target.value)}
                  placeholder="Optional: species ID"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Source Toggles */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-700 mb-3">
                  Data Sources
                </label>
                <div className="space-y-2">
                  {(["gbif", "iucn", "semantyfish"] as const).map((source) => (
                    <label
                      key={source}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        onClick={() => toggleSource(source)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                          enabledSources[source]
                            ? "bg-emerald-600 border-emerald-600"
                            : "bg-white border-stone-300 group-hover:border-emerald-400"
                        }`}
                      >
                        {enabledSources[source] && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-stone-700 font-medium capitalize">
                        {source === "gbif"
                          ? "GBIF"
                          : source === "iucn"
                            ? "IUCN Red List"
                            : "SemantyFish"}
                      </span>
                      {loading[source] && (
                        <Loader2 className="w-4 h-4 text-emerald-600 animate-spin ml-auto" />
                      )}
                      {errors[source] && (
                        <X className="w-4 h-4 text-rose-600 ml-auto" />
                      )}
                      {!loading[source] &&
                        !errors[source] &&
                        apiData[source] && (
                          <Check className="w-4 h-4 text-emerald-600 ml-auto" />
                        )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Fetch Species Data
              </button>
            </div>

            {/* Raw JSON Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-stone-200 bg-stone-50">
                {(["normalized", "gbif", "iucn", "semantyfish"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 font-semibold text-sm transition ${
                        activeTab === tab
                          ? "bg-white text-emerald-700 border-b-2 border-emerald-600"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ),
                )}
              </div>

              {/* Tab Content */}
              <div className="p-4">
                <div className="bg-stone-900 rounded-lg p-4 max-h-[600px] overflow-auto">
                  <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap break-words">
                    {activeTab === "normalized" &&
                      JSON.stringify(normalized, null, 2)}
                    {activeTab === "gbif" &&
                      (apiData.gbif
                        ? JSON.stringify(apiData.gbif, null, 2)
                        : errors.gbif
                          ? `Error: ${errors.gbif}`
                          : loading.gbif
                            ? "Loading..."
                            : "No data yet. Run a search.")}
                    {activeTab === "iucn" &&
                      (apiData.iucn
                        ? JSON.stringify(apiData.iucn, null, 2)
                        : errors.iucn
                          ? `Error: ${errors.iucn}`
                          : loading.iucn
                            ? "Loading..."
                            : "No data yet. Run a search.")}
                    {activeTab === "semantyfish" &&
                      (apiData.semantyfish
                        ? JSON.stringify(apiData.semantyfish, null, 2)
                        : errors.semantyfish
                          ? `Error: ${errors.semantyfish}`
                          : loading.semantyfish
                            ? "Loading..."
                            : "No data yet. Run a search.")}
                  </pre>
                </div>
              </div>
            </div>

            {/* Mapping Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
              <button
                onClick={() => setShowMappingTable(!showMappingTable)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition"
              >
                <h3 className="text-lg font-bold text-stone-900">
                  API Field Mapping
                </h3>
                {showMappingTable ? (
                  <ChevronUp className="w-5 h-5 text-stone-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-600" />
                )}
              </button>

              {showMappingTable && (
                <div className="border-t border-stone-200 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-stone-700">
                          UI Field
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-stone-700">
                          Source API
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-stone-700">
                          Raw Field
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-stone-700">
                          Displayed Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="px-4 py-2">Common Name</td>
                        <td className="px-4 py-2">GBIF / SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          vernacularName / common_name
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.commonName}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Scientific Name</td>
                        <td className="px-4 py-2">GBIF / SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          scientificName / scientific_name
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.scientificName}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Family</td>
                        <td className="px-4 py-2">GBIF / SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">family</td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.family}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Genus</td>
                        <td className="px-4 py-2">GBIF / SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">genus</td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.genus}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">IUCN Status</td>
                        <td className="px-4 py-2">IUCN</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          category
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.iucnStatus}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Population Trend</td>
                        <td className="px-4 py-2">IUCN</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          populationTrend
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.populationTrend}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Habitat</td>
                        <td className="px-4 py-2">GBIF / IUCN / SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">habitat</td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.habitat}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Max Length</td>
                        <td className="px-4 py-2">SemantyFish / GBIF</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          max_length / lengthMax
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.maxLength}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Body Shape</td>
                        <td className="px-4 py-2">SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          body_shape
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.bodyShape}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Diet</td>
                        <td className="px-4 py-2">SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">diet</td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.diet}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">CITES</td>
                        <td className="px-4 py-2">SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">cites</td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.cites}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Aquarium Demand</td>
                        <td className="px-4 py-2">SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          aquarium_demand
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.aquariumDemand}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Demand Details</td>
                        <td className="px-4 py-2">SemantyFish</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          aquarium_demand.details
                        </td>
                        <td className="px-4 py-2 truncate max-w-[150px]">
                          {normalized.aquariumDemandDetails}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Live Profile Preview */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <FishIcon className="w-7 h-7 text-emerald-600" />
              Live Profile Preview
            </h2>

            {/* Species Header */}
            <div className="mb-6 pb-6 border-b border-stone-200">
              <h3 className="text-3xl font-extrabold text-stone-900 mb-2">
                {normalized.commonName}
              </h3>
              <p className="text-lg text-stone-600 italic mb-4">
                {normalized.scientificName}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                  {normalized.type}
                </span>
                {normalized.inMalaysiaChecklist && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    GBIF Malaysia Checklist
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    normalized.iucnStatus === "Least Concern"
                      ? "bg-green-100 text-green-800"
                      : normalized.iucnStatus === "Vulnerable"
                        ? "bg-orange-100 text-orange-800"
                        : normalized.iucnStatus === "Endangered"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-stone-100 text-stone-800"
                  }`}
                >
                  IUCN: {normalized.iucnStatus}
                </span>
              </div>
            </div>

            {/* Taxonomy */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-stone-900 mb-3">
                Taxonomy
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-stone-700">Family:</span>
                  <span className="ml-2 text-stone-600">
                    {normalized.family}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700">Genus:</span>
                  <span className="ml-2 text-stone-600">
                    {normalized.genus}
                  </span>
                </div>
                {normalized.subspecies !== "N/A" && (
                  <div className="col-span-2">
                    <span className="font-semibold text-stone-700">
                      Subspecies:
                    </span>
                    <span className="ml-2 text-stone-600">
                      {normalized.subspecies}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Conservation Status */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-stone-900 mb-3">
                Conservation Status
              </h4>
              <div className="bg-stone-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">
                    IUCN Red List:
                  </span>
                  <span className="text-stone-900 font-bold">
                    {normalized.iucnStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">
                    Population Trend:
                  </span>
                  <span className="text-stone-900">
                    {normalized.populationTrend}
                  </span>
                </div>
              </div>
            </div>

            {/* Habitat & Distribution */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-stone-900 mb-3">
                Habitat & Distribution
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-stone-700">Habitat:</span>
                  <p className="text-stone-600 mt-1">{normalized.habitat}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-700">
                    Distribution:
                  </span>
                  <p className="text-stone-600 mt-1">
                    {normalized.distribution}
                  </p>
                </div>
              </div>
            </div>

            {/* Physical Characteristics */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-stone-900 mb-3">
                Physical Characteristics
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-stone-700">
                    Body Shape:
                  </span>
                  <span className="ml-2 text-stone-600">
                    {normalized.bodyShape}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700">Colors:</span>
                  <span className="ml-2 text-stone-600">
                    {normalized.colors}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700">
                    Max Length:
                  </span>
                  <span className="ml-2 text-stone-600">
                    {normalized.maxLength}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-700">
                    Max Weight:
                  </span>
                  <span className="ml-2 text-stone-600">
                    {normalized.maxWeight}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-stone-700">
                    Lifespan:
                  </span>
                  <span className="ml-2 text-stone-600">
                    {normalized.lifespan}
                  </span>
                </div>
              </div>
            </div>

            {/* Behavior & Diet */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-stone-900 mb-3">
                Behavior & Diet
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-stone-700">Diet:</span>
                  <p className="text-stone-600 mt-1">{normalized.diet}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-700">
                    Activity:
                  </span>
                  <p className="text-stone-600 mt-1">{normalized.activity}</p>
                </div>
              </div>
            </div>

            {/* Trade & Regulations */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-stone-900 mb-3">
                Trade & Regulations
              </h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">
                    CITES Status:
                  </span>
                  <span className="text-stone-900">{normalized.cites}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">
                    Aquarium Demand:
                  </span>
                  <span className="text-stone-900">
                    {normalized.aquariumDemand}
                  </span>
                </div>
              </div>
            </div>

            {/* SemantyFish Specific (Fish Only) */}
            {normalized.type === "Fish" && apiData.semantyfish && (
              <div className="mb-6 bg-sky-50 border border-sky-200 rounded-lg p-4">
                <h4 className="text-lg font-bold text-sky-900 mb-3 flex items-center gap-2">
                  <FishIcon className="w-5 h-5" />
                  SemantyFish Data (Fish Only)
                </h4>
                <p className="text-sm text-sky-700">
                  Additional fish-specific data from SemantyFish API available.
                  See raw JSON for full details.
                </p>
              </div>
            )}

            {/* No Data State */}
            {!apiData.gbif && !apiData.iucn && !apiData.semantyfish && (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 text-lg font-medium mb-2">
                  No species data loaded
                </p>
                <p className="text-stone-400 text-sm">
                  Search for a species to preview the merged profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
