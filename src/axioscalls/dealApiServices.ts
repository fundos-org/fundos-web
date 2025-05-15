import axios from "axios";

const baseUrl = "http://43.205.36.168/api/v1/live/deals/";

const createDraftTrigger = async () => {
    const response = await axios
        .post(`${baseUrl}web/create/draft`, {
            fund_manager_id: "9c0e5407-c3f2-402e-891b-0e4f2489e837", // hard coded this for now
        });
    return response.data;
};

export const companyDetailsTrigger = async (dealId: string, companyName: string, aboutCompany: string, companyWebsite: string, logo: File | null) => {
    // console.log(dealId, companyName, aboutCompany, companyWebsite, logo, 'company details trigger');
    const formData = new FormData();
    if (logo) {
    formData.append("logo", logo);
  }
    const response = await axios
        .post(`${baseUrl}web/company-details?deal_id=${dealId}&company_name=${companyName}&about_company=${aboutCompany}&company_website=${companyWebsite}`, formData);
    return response.data;
};

export const industryProblemTrigger = async (dealId: string, industry: string, problemStatement: string, businessModel: string) => {
    console.log(dealId, industry, problemStatement, businessModel, 'industry problem trigger');
    const response = await axios
        .post(`${baseUrl}web/industry-problem`, {
            deal_id: dealId,
            industry: industry,
            problem_statement: problemStatement,
            business_model: businessModel
        });
    return response.data;
}

export const customerSegmentTrigger = async (dealId: string, companyStage: string, targetCustomerSegment: string) => {
    
    const response = await axios
        .post(`${baseUrl}web/customer-segment`, {
            deal_id: dealId,
            company_stage: companyStage,
            target_customer_segment: targetCustomerSegment
        });
    return response.data;
};

export const valuationTrigger = async (dealId: string, currentValuation: string, roundSize: string, syndicateCommitment: string, pitch_deck?: File | null, pitch_video?: File | null) => {
    const formData = new FormData();
    if (pitch_deck && pitch_deck instanceof File) {
        formData.append("pitch_deck", pitch_deck);
    }
    if (pitch_video && pitch_video instanceof File) {
        formData.append("pitch_video", pitch_video);
    }
    const response = await axios
        .post(`${baseUrl}web/valuation?deal_id=${dealId}&current_valuation=${currentValuation}&round_size=${roundSize}&syndicate_commitment=${syndicateCommitment}`, formData);
    return response.data;
};

export const securitiesTrigger = async (dealId: string, instrumentType: string, conversionTerms: string, isStartup: boolean) => {
    const response = await axios
        .post(`${baseUrl}web/securities`, {
            deal_id: dealId,
            instrument_type: instrumentType,
            conversion_terms: conversionTerms,
            is_startup: isStartup
        });
    return response.data;
};

export const allDealsTrigger = async () => {
    const response = await axios
        .get(`${baseUrl}mobile/all-deals`);
    return response.data;
}

export const dealWithIdTrigger = async (dealId: string) => {
    const response = await axios
        .get(`${baseUrl}mobile/${dealId}`);
    return response.data;
}

export default createDraftTrigger;